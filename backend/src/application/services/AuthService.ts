import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AUTH_ACTOR_TYPES, USER_ROLES } from "../../domain/constants.js";
import { AppError } from "../../shared/errors/AppError.js";

interface AuthServiceDeps {
  userRepository: {
    findByEmail(email: string, options?: { includePassword?: boolean }): Promise<unknown>;
    create(data: Record<string, unknown>): Promise<unknown>;
  };
  doctorRepository: {
    findByEmail(email: string, options?: { includePassword?: boolean }): Promise<unknown>;
  };
}

export class AuthService {
  private userRepository: AuthServiceDeps["userRepository"];
  private doctorRepository: AuthServiceDeps["doctorRepository"];

  constructor({ userRepository, doctorRepository }: AuthServiceDeps) {
    this.userRepository = userRepository;
    this.doctorRepository = doctorRepository;
  }

  async register(input: { email: string; password: string; name: string; phone?: string; gender?: string; bloodType?: string }): Promise<{ user: unknown; token: string }> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError("Email is already registered", 409, "EMAIL_EXISTS");
    }

    const user = await this.userRepository.create({
      ...input,
      role: USER_ROLES.PATIENT,
    });

    return {
      user,
      token: this.#signToken({
        sub: (user as { id: string }).id,
        role: (user as { role: string }).role,
        type: AUTH_ACTOR_TYPES.USER,
      }),
    };
  }

  async login({ email, password }: { email: string; password: string }): Promise<{ user: unknown; token: string }> {
    const user = await this.userRepository.findByEmail(email, {
      includePassword: true,
    }) as { id: string; role: string; comparePassword(candidate: string): Promise<boolean>; toJSON(): unknown } | null;

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    return {
      user: user.toJSON(),
      token: this.#signToken({
        sub: user.id,
        role: user.role,
        type: AUTH_ACTOR_TYPES.USER,
      }),
    };
  }

  async loginDoctor({ email, password }: { email: string; password: string }): Promise<{ doctor: unknown; token: string }> {
    const doctor = await this.doctorRepository.findByEmail(email, {
      includePassword: true,
    }) as { id: string; approvalStatus: string; comparePassword(candidate: string): Promise<boolean>; toJSON(): unknown } | null;

    if (!doctor || !(await doctor.comparePassword(password))) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    return {
      doctor: doctor.toJSON(),
      token: this.#signToken({
        sub: doctor.id,
        type: AUTH_ACTOR_TYPES.DOCTOR,
        approvalStatus: doctor.approvalStatus,
      }),
    };
  }

  #signToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
  }
}
