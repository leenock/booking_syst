interface VisitorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
}

interface ValidationError {
  message: string;
  field?: string;
}

export const validateVisitorForm = (formData: VisitorFormData): ValidationError | null => {
  // First name and last name validation
  if (!formData.firstName || !formData.lastName) {
    return {
      message: "First name and last name are required",
      field: !formData.firstName ? "firstName" : "lastName"
    };
  }

  // Email validation
  if (!formData.email) {
    return {
      message: "Email is required",
      field: "email"
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return {
      message: "Please enter a valid email address",
      field: "email"
    };
  }

  // Phone validation
  if (!formData.phone) {
    return {
      message: "Phone number is required",
      field: "phone"
    };
  }

  // Password validation
  if (!formData.password) {
    return {
      message: "Password is required",
      field: "password"
    };
  }

  if (formData.password.length < 6) {
    return {
      message: "Password must be at least 6 characters long",
      field: "password"
    };
  }

  // Confirm password validation
  if (formData.password !== formData.confirmPassword) {
    return {
      message: "Passwords do not match",
      field: "confirmPassword"
    };
  }

  return null;
}; 