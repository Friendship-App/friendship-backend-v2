import {
  dbCreatPushNotification,
  dbGetPushNotifications,
} from '../../models/admin/pushNotifications';
import { sendPushNotifications } from '../../utils/notifications';
import { dbGetAllNotificationTokens } from '../../models/admin/users';

export const createPushNotification = async function(request) {
  const notificationTokens = await dbGetAllNotificationTokens();
  const { notification } = request.payload;

  sendPushNotifications(notificationTokens, notification);

  return dbCreatPushNotification({
    time: new Date(),
    senderId: request.pre.user.id,
    notification,
  });
};

export const getPushNotifications = (request, reply) => {
  return dbGetPushNotifications().then(pushNotifications =>
    reply.response(pushNotifications),
  );
};
