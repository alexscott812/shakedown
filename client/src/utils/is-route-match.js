const isRouteMatch = (currentRoute, linkRoute, isExact = true) => {
  return (isExact)
    ? currentRoute === linkRoute
    : currentRoute.substring(0, linkRoute.length) === linkRoute;
};

export default isRouteMatch;