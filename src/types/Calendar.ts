export interface Calendar {
  Date: string; // Represent DATE as string in TS
  DayOfWeek: string;
  IsHoliday: boolean; // Represent BOOLEAN as boolean in TS, default FALSE in DB
  HolidayName?: string | null;
}
