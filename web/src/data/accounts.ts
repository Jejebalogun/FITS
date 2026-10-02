// Mock accounts standing in for the users table until an auth provider is wired up.
// Shaped the way the real API would return a user: one record per person, buyer by
// default, `isCreator` as a privilege on the same account rather than a second account.
export type Account = {
  email: string;
  password: string;
  /** Month the account was created, as the sign-up conflict card shows it. */
  joined: string;
  isCreator: boolean;
};

export const accounts: Account[] = [
  {
    email: "amara.obi@gmail.com",
    password: "fitslagos1",
    joined: "March",
    isCreator: false,
  },
  {
    email: "tunde.adeyemi@gmail.com",
    password: "adirestudio7",
    joined: "January",
    isCreator: true,
  },
];

export function findAccount(email: string) {
  const normalised = email.trim().toLowerCase();
  return accounts.find((account) => account.email === normalised);
}

/** Stand-in for the network round trip, so loading states are visible. */
export function pause(ms = 900) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
