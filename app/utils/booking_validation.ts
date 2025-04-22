export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  adults: number;
  kids: number;
  specialRequest: string;
  roomType: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  paymentMethod: string;
}
export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  adults?: number;
  kids?: number;
  specialRequest?: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  paymentMethod?: string;
}
export const validateBookingForm = (
  formData: BookingFormData,
  isEdit: boolean = false
): FormErrors => {
  const errors: FormErrors = {};
  // First Name validation
  if (!formData.fullName?.trim()) {
    errors.fullName = "Full Name is required right now";
  }
  // Email validation
  if (!formData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }
  // Phone validation
  if (!formData.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
    errors.phone =
      "Please enter a valid phone number in international format (e.g., +254712345678)";
  }

  // Special Request validation
  if (!formData.specialRequest?.trim()) {
    errors.specialRequest = "Special request is required";
  }
  // Room Type validation
  if (!formData.roomType?.trim()) {
    errors.roomType = "Room type is required";
  }
  // Check-in validation
  if (!formData.checkIn?.trim()) {
    errors.checkIn = "Check-in date is required";
  }
  // Check-out validation
  if (!formData.checkOut?.trim()) {
    errors.checkOut = "Check-out date is required";
  }
  // Payment Method validation
  if (!formData.paymentMethod?.trim()) {
    errors.paymentMethod = "Payment method is required";
  }
  return errors;
};

export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
