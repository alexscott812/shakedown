import { useInfiniteQuery } from "react-query";
import { getSongs } from "../../services/song-service.js";
import useToast from "../useToast.js";

const useSongs = (query, opts) => {
  const createToast = useToast();

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["songs", query],
    ({ pageParam = 1 }) =>
      getSongs({
        ...query,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.meta.current_page < lastPage.meta.total_pages
          ? lastPage.meta.current_page + 1
          : false;
      },
      onError: (err) =>
        createToast({
          id: "get-songs-error",
          status: "error",
          message: err,
        }),
      ...opts,
    }
  );

  const metaReduced = data?.pages[data.pages.length - 1].meta || undefined;

  const dataReduced =
    data?.pages.reduce((allData, currData) => {
      return [...allData, ...currData.data];
    }, []) || undefined;

  return {
    data: dataReduced,
    meta: metaReduced,
    isLoading,
    isError,
    error,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    isLoadingMore: isFetchingNextPage,
    hasNoData: (!dataReduced && !isLoading) || metaReduced?.total_results === 0,
  };
};

export default useSongs;
