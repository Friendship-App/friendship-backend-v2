import { dbCreatPushNotification } from '../../models/admin/pushNotifications';

export const createPushNotification = async function(request) {
  return dbCreatPushNotification({
    time: new Date(),
    senderId: request.pre.user.id,
    notification: request.payload.notification,
  });
};
