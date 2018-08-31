import {
  displayRegisteredUsers,
  updateRegisteredUsers,
  displayActiveUsers,
  updateActiveUsers,
  displayActiveConversation,
  updateActiveConversations,
  displayConversationsLength,
  updateAverageConversationsLength,
  displayAllMetrics,
  displayWeekMetrics,
  displayMonthMetrics,
  testMetrics,
} from '../../handlers/admin/metrics';
import { getAuthWithScope } from '../../utils/auth';

const metrics = [
  {
    method: 'GET',
    path: '/api/admin/metrics/activeusers',
    config: getAuthWithScope('admin'),
    handler: displayActiveUsers,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/activeusers/update',
    config: getAuthWithScope('admin'),
    handler: updateActiveUsers,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/registeredusers',
    config: getAuthWithScope('admin'),
    handler: displayRegisteredUsers,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/registeredusers/update',
    config: getAuthWithScope('admin'),
    handler: updateRegisteredUsers,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/activeconversations',
    config: getAuthWithScope('admin'),
    handler: displayActiveConversation,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/activeconversations/update',
    config: getAuthWithScope('admin'),
    handler: updateActiveConversations,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/conversationslength',
    config: getAuthWithScope('admin'),
    handler: displayConversationsLength,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/conversationslength/update',
    config: getAuthWithScope('admin'),
    handler: updateAverageConversationsLength,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics',
    config: getAuthWithScope('admin'),
    handler: displayAllMetrics,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/week',
    config: getAuthWithScope('admin'),
    handler: displayWeekMetrics,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/month',
    config: getAuthWithScope('admin'),
    handler: displayMonthMetrics,
  },
  {
    method: 'GET',
    path: '/api/admin/metrics/cron',
    config: getAuthWithScope('admin'),
    handler: testMetrics,
  },
];

export default metrics;

export const routes = server => server.route(metrics);
