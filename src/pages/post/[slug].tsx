import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
  return (
    <main className={commonStyles.contentBox}>
      <div className={styles.postContent}>
        <h1>Como utilizar hooks</h1>
        <p>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</p>
        <div>
          <small>data</small>
          <small>username</small>
        </div>
      </div>

      <div className={styles.postContent}>
        <h1>Como utilizar hooks</h1>
        <p>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</p>
        <div>
          <small>data</small>
          <small>username</small>
        </div>
      </div>

      <p>Carregar mais posts</p>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };

  const prismic = getPrismicClient({});
  const posts = await prismic.getByType(TODO);

  // TODO
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug: response.uid,
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  };
};
