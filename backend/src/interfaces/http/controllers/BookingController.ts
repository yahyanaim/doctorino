import { Request, Response } from "express";
import { getAuth, getValidatedBody } from "../../../shared/utils/requestContext.js";

interface BookingControllerDeps {
  bookingService: {
    createBooking(userId: string, input: Record<string, unknown>): Promise<unknown>;
    listMyBookings(userId: string): Promise<unknown>;
    updateStatus(bookingId: string, status: string): Promise<unknown>;
  };
}

export class BookingController {
  private bookingService: BookingControllerDeps["bookingService"];

  constructor({ bookingService }: BookingControllerDeps) {
    this.bookingService = bookingService;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const auth = getAuth(req);
    const booking = await this.bookingService.createBooking(
      auth.sub,
      getValidatedBody(req),
    );
    res.status(201).json({ success: true, data: booking });
  };

  listMine = async (req: Request, res: Response): Promise<void> => {
    const auth = getAuth(req);
    const bookings = await this.bookingService.listMyBookings(auth.sub);
    res.json({ success: true, data: bookings });
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const body = getValidatedBody<{ status: string }>(req);
    const booking = await this.bookingService.updateStatus(
      req.params.id as string,
      body.status,
    );
    res.json({ success: true, data: booking });
  };
}
