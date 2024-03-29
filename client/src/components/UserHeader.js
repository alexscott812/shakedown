import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Text, Stack, Avatar, Icon } from '@chakra-ui/react';
import Card from './Card.js';
import CardBody from './CardBody.js';
import CardTitle from './CardTitle.js';
import { FaPen, FaCog, FaCalendar, FaComment } from 'react-icons/fa';
import { useAuth } from '../lib/auth';
import getRelativeTime from '../utils/get-relative-time.js';

const UserHeader = ({
  user = null,
  onShowEditUserButtonClick = null,
  ...restProps
}) => {
  const { user: currentUser } = useAuth();

  const isCurrentUser = user._id === currentUser?._id;

  return (
    <Card {...restProps}>
      <CardBody>
        <Avatar size="lg" name={user.username} mb={3} />
        <CardTitle mb={2}>
          {/* {isCurrentUser
            ? `${user.first_name} ${user.last_name} (you)`
            : `${user.first_name} ${user.last_name.charAt(0)}.`} */}
          {`${user.username}${isCurrentUser ? ' (you)' : ''}`}
        </CardTitle>
        {user.bio && <Text mb={2}>{user.bio}</Text>}
        <Text variant="secondary">
          <Icon as={FaCalendar} mr={2} />
          {`Joined ${getRelativeTime(user.created_at)}`}
        </Text>
        <Text variant="secondary">
          <Icon as={FaComment} mr={2} />
          {`${user.review_count} show reviews`}
        </Text>
        {isCurrentUser && (
          <Stack direction={['column', 'column', 'row', 'row']} mt={3}>
            <Button
              variant="solid"
              colorScheme="gray"
              onClick={onShowEditUserButtonClick}
              leftIcon={<FaPen />}
            >
              Edit Profile
            </Button>
            <Button
              as={RouterLink}
              to="/settings"
              colorScheme="gray"
              leftIcon={<FaCog />}
              mt={3}
            >
              Settings
            </Button>
          </Stack>
        )}
      </CardBody>
    </Card>
  );
};

export default UserHeader;
