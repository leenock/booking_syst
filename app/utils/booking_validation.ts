interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  adults: number;
  kids: number;
  specialRequest: string;
  roomType: string;
  roomPrice: number;
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
  roomPrice?: number;
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
    errors.fullName = "Full Name is required";
  }








  
  return errors;
};

export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
