import users from './users';
import messages from './messages';
import locations from './locations';
import avatars from './avatars';
import personalities from './personalities';
import tags from './tags';
import register from './register';
import login from './login';
import chatrooms from './chatrooms';

const routes = [].concat(
  avatars,
  locations,
  login,
  messages,
  personalities,
  register,
  tags,
  users,
  chatrooms,
);

export default routes;
