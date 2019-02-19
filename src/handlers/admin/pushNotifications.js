import {
  dbCreatPushNotification,
  dbGetPushNotifications,
} from '../../models/admin/pushNotifications';

export const createPushNotification = async function(request) {
  return dbCreatPushNotification({
    time: new Date(),
    senderId: request.pre.user.id,
    notification: request.payload.notification,
  });
};

export const getPushNotifications = (request, reply) => {
  return dbGetPushNotifications().then(pushNotifications =>
    reply.response(pushNotifications),
  );
};
