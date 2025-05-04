// Central export point for all API modules

export * from "./flights";
export * from "./bookings";
export * from "./auth";
export * from "./tickets";

// You can add other API modules here as needed, e.g.:
// export * from "./locations";
// export * from "./aircraft";
// export * from "./luggage";
// export * from "./payments";

// Define the base URL for the actual backend API
// This should be configured based on the deployment environment
export const API_BASE_URL = process.env.REACT_APP_API_URL || "/api"; // Example using environment variable

