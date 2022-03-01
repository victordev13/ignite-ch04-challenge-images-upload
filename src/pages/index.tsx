import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { AxiosResponse } from 'axios';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { LoadMoreButton } from '../components/LoadMoreButton';

type ImageDetail = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type Page = {
  data: ImageDetail[];
  after: null | string;
};

const fetch = ({ pageParam = null }): Promise<AxiosResponse<Page>> => {
  return api.get('/images');
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetch, {
    getNextPageParam: lastPage => lastPage.data?.after ?? null,
  });

  const formattedData = useMemo(() => {
    return data?.pages.map(page => page.data.data).flat(1);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <LoadMoreButton
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          />
        )}
      </Box>
    </>
  );
}
