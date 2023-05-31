export interface Error {
  message: string;
  description: string;
  route: string;
}
export const Errors: { [key: string]: Error } = {
  '404': {
    message: 'Page Not Found ⚠️',
    description: "we couldn't find the page you are looking for",
    route: '/login',
  },
  '401': {
    message: 'You are not authorized! 🔐',
    description: 'You don’t have permission to access this page. Go Home!',
    route: '/login',
  },
  '500': {
    message: 'Internal server error',
    description: 'Oops somthing went wrong.',
    route: '/login',
  },
  '100': {
    message: 'Under Maintenance! 🚧',
    description:
      "Sorry for the inconvenience but we're performing some maintenance at the moment.",
    route: '/login',
  },
};
