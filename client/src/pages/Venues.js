import React from 'react';
import { Box, Button, Heading, Flex } from '@chakra-ui/react';
import Card from '../components/Card.js';
import CardBody from '../components/CardBody.js';
import EmptyState from '../components/EmptyState.js';
import VenueResults from '../components/VenueResults.js';
import VenueResultsSkeleton from '../components/VenueResultsSkeleton.js';
import PageContainer from '../components/PageContainer.js';
// import PageHead from '../components/PageHead.js';
import SortSelect from '../components/SortSelect.js';
import ResultsCount from '../components/ResultsCount.js';
import { VENUE_SORT_OPTIONS } from '../constants.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import useQueryParams from '../hooks/useQueryParams.js';
import useVenues from '../hooks/queries/useVenues.js';
import useDebounce from '../hooks/useDebounce.js';

const Venues = () => {
  useDocumentTitle('Venues | shakedown');
  const [query, setQuery] = useQueryParams(['search', 'sort']);
  const debouncedSearch = useDebounce(query.q, 300);

  const {
    data: venuesData,
    meta: venuesMeta,
    isLoading: venuesIsLoading,
    hasMore: hasMoreVenues,
    loadMore: loadMoreVenues,
    isLoadingMore: isLoadingMoreVenues,
    hasNoData: hasNoVenuesData
  } = useVenues({
    ...query,
    q: debouncedSearch || undefined
  });

  // const handleSearchChange = (e) => {
  //   const newSearch = e.target.value;
  //   let { q, ...restQuery } = query;
  //   let newQuery = { ...restQuery, ...(!!newSearch && { q: newSearch }) };
  //   setQuery(newQuery);
  // };

  // const handleSearchClear = () => {
  //   let { q, ...newQuery } = query;
  //   setQuery(newQuery);
  // };

  const handleSortChange = (newSort) => {
    let newQuery = { ...query, sort: newSort };
    setQuery(newQuery);
  };

  return (
    <>
      {/* <PageHead>
        <Flex h={14} alignItems="center" justifyContent="space-between">
          <Box>
            <Heading as="h4" fontWeight="semibold" size="md">
              Venues
            </Heading>
          </Box>
          <Spacer />
          <Box w={["50%", "50%", "25%", "25%"]}>
            <SearchBar
              search={query.q}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
            />
          </Box>
        </Flex>
      </PageHead>
      <PageContainer pt={18}> */}
      <PageContainer>
        <Card mb={4}>
          <CardBody px={4} py={1}>
            <Flex h={14} alignItems="center" justifyContent="space-between">
              <Box>
                <Heading as="h4" fontWeight="semibold" size="md">
                  Venues
                </Heading>
              </Box>
            </Flex>
          </CardBody>
        </Card>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Box>
            <ResultsCount count={venuesMeta?.total_results} />
          </Box>
          <Box>
            <SortSelect
              value={query.sort}
              options={VENUE_SORT_OPTIONS}
              onChange={handleSortChange}
            />
          </Box>
        </Flex>
        {venuesIsLoading && <VenueResultsSkeleton />}
        {venuesData && (
          <>
            <VenueResults venues={venuesData} mb={4} />
            {hasMoreVenues && (
              <Flex justify="center">
                <Button
                  colorScheme="brand"
                  isLoading={isLoadingMoreVenues}
                  loadingText="Loading More..."
                  isDisabled={isLoadingMoreVenues}
                  onClick={loadMoreVenues}
                >
                  Load More
                </Button>
              </Flex>
            )}
          </>
        )}
        {hasNoVenuesData && <EmptyState />}
      </PageContainer>
    </>
  );
};

export default Venues;
