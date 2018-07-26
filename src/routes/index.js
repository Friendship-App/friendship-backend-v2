import users from './users';
import messages from './messages';
import locations from './locations';
import avatars from './moods';
import personalities from './personalities';
import tags from './tags';
import register from './register';
import login from './login';
import chatrooms from './chatrooms';
import events from './events';
import aws from './aws';

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
  events,
  aws,
);

export default routes;
