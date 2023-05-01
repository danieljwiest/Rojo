//Code taken from this stack exchange thread:
//https://stackoverflow.com/questions/54738221/typescript-array-find-possibly-undefined

export default function ensure<T>(
  argument: T | undefined | null,
  message = "This value was promised to be there."
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}
