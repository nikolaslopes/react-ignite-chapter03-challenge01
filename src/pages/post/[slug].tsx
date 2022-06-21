import { asHTML } from '@prismicio/helpers';
import { RTNode } from '@prismicio/types';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import { formatDate } from '../../helpers/formatDate';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  minutesForReading: string;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: string;
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  let postFormatted: Post = null;

  if (post) {
    postFormatted = {
      first_publication_date: formatDate(post.first_publication_date),
      minutesForReading: calculateMinutesForReading(post.data.content),
      data: {
        title: post.data.title,
        banner: { url: post.data.banner.url },
        author: post.data.author,
        content: post.data.content.map(section => ({
          heading: section.heading,
          body: asHTML(section.body as [RTNode, ...RTNode[]]),
        })),
      },
    };
  }

  return (
    postFormatted && (
      <>
        <div className={styles.headerPostContainer}>
          <Header />
        </div>

        <div className={styles.banner}>
          <img
            src="https://gmedia.playstation.com/is/image/SIEPDC/horizon-forbidden-west-screenshot-02-disclaimer-02oct20?$native$"
            alt="Banner"
          />
        </div>

        <main className={styles.postContent}>
          <article>
            <header>
              <h1>Criando um app</h1>

              <div className={styles.postInfo}>
                <time>
                  <FiCalendar />
                  {formatDate(post.first_publication_date)}
                </time>

                <small>
                  <FiUser /> {post.data.author}
                </small>

                <small>
                  <FiClock /> {123}
                </small>
              </div>

              <section />
            </header>
          </article>
        </main>
      </>
    )
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    pageSize: 10,
  });

  return {
    paths: posts.results.map(post => ({ params: { slug: post.uid } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(response);

  return {
    props: {
      post: response,
    },
    redirect: 60 * 60 * 24, // 24 minutes
  };
};
