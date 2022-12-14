import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import useStateWithLocalStorage from '../../hooks/useStateWithLocalStorage.js';
import { useNavigate } from 'react-router-dom';
import {
  addUser,
  deleteUser,
  updateUser,
  getUserById,
  forgotPassword as forgotUserPassword,
  resetPassword as resetUserPassword,
  changePassword as changeUserPassword
} from '../../services/user-service.js';

import {
  addToken,
  refreshToken,
  deleteToken
} from '../../services/auth-service.js';
import isTokenValid from '../../utils/is-token-valid.js';
import getUserIdFromToken from '../../utils/get-user-id-from-token.js';
import AuthContext from './AuthContext.js';
import useToast from '../../hooks/useToast.js';

const AuthProvider = ({ client, children }) => {
  if (!client) {
    throw Error('AuthProvider must be used with an AuthClient.');
  }
  const createToast = useToast();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  const [token, setToken] = useStateWithLocalStorage(client.tokenLocalStorageKey, '');
  const [userId, setUserId] = useState(() => getUserIdFromToken(token));
  
  useEffect(() => setUserId(getUserIdFromToken(token)), [token]);

  const {
    data: user,
    isLoading: isUserLoading
  } = useQuery(
    ['users', userId],
    () => getUserById(userId),
    {
      enabled: !!userId && !isInitializing
    }
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        await getToken();
      } catch(err) {
        console.error(err);
      }
      setIsInitializing(false);
      return;
    };
    if (isInitializing) {
      initAuth();
    }
  }, []);

  /**
   * Return access token if valid. If access token is invalid, try to get
   * refreshed token from server. If server responds with 4XX/5XX error code
   * on refresh token request, then logout. If server doesn't respond or times
   * out, throw error for the calling component to handle.
   */
  const getToken = useCallback(async () => {
    if (!token) {
      return null;
    }
    if (token && isTokenValid(token)) {
      return token;
    }
    try {
      const { access_token } = await refreshToken();
      setToken(access_token);
      return access_token;
    } catch (err) {
      setToken('');
      throw Error(err);
    }
  }, [token, setToken]);

  /**
   * Get new token with login credentials and set token and user state.
   */
  // const login = useCallback(async ({ credentials, opts }) => {
  //   const { access_token } = await addToken(credentials);
  //   setToken(access_token);
  //   navigate(opts?.redirectTo || '/');
  //   return;
  // }, [setToken, navigate]);

  const loginMutation = useMutation(
    addToken, {
      onSuccess: (data, variables) => {
        const { access_token } = data;
        setToken(access_token);
        navigate(variables?.opts?.redirectTo || '/');
      }
    }
  );

  /**
   * Delete refresh token from server and clear token and user state.
   */
  // const logout = useCallback(async (opts) => {
  //   await deleteToken();
  //   setToken('');
  //   if (opts?.returnTo) {
  //     navigate(opts?.returnTo);
  //   }
  //   return;
  // }, [setToken, navigate]);

  const logoutMutation = useMutation(
    deleteToken, {
      onSuccess: (_, variables) => {
        setToken('');
        console.log(variables);
        if (variables?.opts?.returnTo) {
          navigate(variables?.opts?.returnTo);
        }
      }
    }
  );

  /**
   * Add user.
   */
  const register = useCallback(async ({ userInfo, opts }) => {
    const newUser = await addUser(userInfo);
    return newUser;
  }, []);

  /**
   * Update user.
   */
  const updateAccount = useCallback(async ({ user: u }) => {
    const t = await getToken();
    const updatedUser = await updateUser({ user: u, token: t });
    return updatedUser;
  }, [getToken]);

  /**
   * Change password.
   */
  // const changePassword = useCallback(async ({ passwords }) => {
  //   await changeUserPassword({ passwords, getToken });
  // }, [getToken]);

  const changePasswordMutation = useMutation(changeUserPassword);

  /**
   * Reset password.
   */
  const resetPassword = useCallback(async ({ passwords, token }) => {
    await resetUserPassword({ passwords, token });
  }, []);

  /**
   * Forgot password.
   */
  const forgotPassword = useCallback(async ({ email }) => {
    await forgotUserPassword(email);
  }, []);

  /**
   * Delete user.
   */
  const deleteAccount = useCallback(async ({ opts }) => {
    const userId = user._id;
    await deleteUser({ userId, getToken });
    if (opts?.returnTo) {
      navigate.push(opts?.returnTo);
    }
  }, [user, getToken, navigate]);

  return (
    <>
      {isInitializing || isUserLoading
        ? <></>
        : <AuthContext.Provider
            value={{
              user,
              isAuthenticated: !!user,
              getToken,
              login: loginMutation,
              logout: logoutMutation,
              register,
              updateAccount,
              deleteAccount,
              changePassword: changePasswordMutation,
              forgotPassword,
              resetPassword
            }}
          >
            {children}
          </AuthContext.Provider>
      }
    </>
  );
};

export default AuthProvider;