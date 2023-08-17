export function isValidEmail(email) {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[a-zA-Z]{2,})$/;
  return emailRegex.test(email);
}

export function isValidUsername(username) {
  const min = 3;
  const max = 25;
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  if (isValidEmail(username)) {
    return "Username cannot be an email address";
  }

  if (username.length < min) {
    return `Username too short, must be at least ${min} characters`;
  }

  if (username.length > max) {
    return `Username too long, must be at most ${max} characters`;
  }

  if (!usernameRegex.test(username)) {
    return "Username can only contain alphanumeric characters and underscores";
  }

  return false;
}
