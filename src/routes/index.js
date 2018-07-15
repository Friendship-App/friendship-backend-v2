import users from './users';
import messages from './messages';
import locations from './locations';
import avatars from './avatars';
import personalities from './personalities';
import tags from './tags';
import register from './register';
import login from './login';

const routes = [].concat(
  avatars,
  locations,
  login,
  messages,
  personalities,
  register,
  tags,
  users,
);

export default routes;
