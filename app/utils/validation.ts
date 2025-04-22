export interface VisitorFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  isActive?: boolean;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateVisitorForm = (
  formData: VisitorFormData,
  isEdit: boolean = false
): FormErrors => {
  const errors: FormErrors = {};

  // First Name validation
  if (!formData.firstName?.trim()) {
    errors.firstName = "First name is required";
  }

  // Last Name validation
  if (!formData.lastName?.trim()) {
    errors.lastName = "Last name is required";
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
    errors.phone = "Please enter a valid phone number, (e.g. +254712345678)";
  }

  // Password validation (only for AddVisitorModal)
  if (!isEdit) {
    if (!formData.password?.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword?.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
};

export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
