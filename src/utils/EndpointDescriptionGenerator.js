const getTags = endpointType => {
  switch (endpointType) {
    case 'users':
      return ['api', 'v1', 'users'];
  }
};

export const getEndpointDescription = (description, type) => ({
  description,
  tags: getTags(type),
});
