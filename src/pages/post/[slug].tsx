import { asHTML } from '@prismicio/helpers';
import { RTNode } from '@prismicio/types';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import { calculateMinutesForReading } from '../../helpers/calculateMinutesForReading';
import { formatDate } from '../../helpers/formatDate';

import { getPrismicClient } from '../../services/prismic';

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
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  let postFormatted: Post = null;

  if (post) {
    postFormatted = {
      first_publication_date: formatDate(post.first_publication_date),
      minutesForReading: calculateMinutesForReading(post.data.content),
      data: {
        title: post.data.title,
        banner: { url: post.data.banner.url },
        author: post.data.author,
        content: post.data.content,
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
          <img src={postFormatted.data.banner.url} alt="Banner" />
        </div>

        <main className={styles.postContent}>
          <article>
            <header>
              <h1>{postFormatted.data.title}</h1>

              <div className={styles.postInfo}>
                <time>
                  <FiCalendar />
                  {postFormatted.first_publication_date}
                </time>

                <small>
                  <FiUser /> {postFormatted.data.author}
                </small>

                <small>
                  <FiClock /> {postFormatted.minutesForReading}
                </small>
              </div>

              {postFormatted.data.content.map(section => (
                <section>
                  <h2>{section.heading}</h2>
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(section.body),
                    }}
                  />
                </section>
              ))}
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

  return {
    props: {
      post: response,
    },
    redirect: 60 * 60 * 24, // 24 minutes
  };
};
