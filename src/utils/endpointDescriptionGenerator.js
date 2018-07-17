const getTags = endpointType => {
  switch (endpointType) {
    case 'avatars':
      return ['api', 'v1', 'avatars'];
    case 'locations':
      return ['api', 'v1', 'locations'];
    case 'login':
      return ['api', 'v1', 'login'];
    case 'messages':
      return ['api', 'v1', 'messages'];
    case 'personalities':
      return ['api', 'v1', 'personalities'];
    case 'register':
      return ['api', 'v1', 'register'];
    case 'tags':
      return ['api', 'v1', 'tags'];
    case 'users':
      return ['api', 'v1', 'users'];
    case 'chatrooms':
      return ['api', 'v1', 'chatrooms'];
    case 'events':
      return ['api', 'v1', 'events'];
    case 'aws':
      return ['api', 'v1', 'aws'];
  }
};

export const getEndpointDescription = (description, type) => ({
  description,
  tags: getTags(type),
});
