import { GetStaticProps } from 'next';

import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Post from './post/[slug]';
import { formatDate } from '../helpers/formatDate';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination?.results);
  const [nextPage, setNextPage] = useState(postsPagination?.next_page);

  const handleLoadMorePosts = async (): Promise<void> => {
    const response = await fetch(nextPage);
    const data = await response.json();

    setPosts([...posts, ...data.results]);
    setNextPage(data.next_page);
  };

  return (
    <>
      <Head>
        <title>Posts | spacetraveling</title>
      </Head>

      <main className={commonStyles.mainContainer}>
        <Header />

        <section className={commonStyles.contentBox}>
          {posts?.map(post => (
            <Link href={`post/${post.uid}`} key={post.uid}>
              <a className={styles.postContent}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>

                <div className={styles.postFooter}>
                  <time>
                    <FiCalendar />
                    {formatDate(post.first_publication_date)}
                  </time>
                  <small>
                    <FiUser /> {post.data.author}
                  </small>
                </div>
              </a>
            </Link>
          ))}

          {nextPage && (
            <footer className={styles.pageAction}>
              <button type="button" onClick={handleLoadMorePosts}>
                Carregar mais posts
              </button>
            </footer>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  return {
    props: {
      postsPagination: postsResponse,
    },

    revalidate: 60 * 60, // 1 hour
  };
};
