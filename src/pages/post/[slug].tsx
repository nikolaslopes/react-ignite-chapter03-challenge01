import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
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

  if (router.isFallback) {
    return <div>Carregando...</div>;
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
              <h1>Criando um app</h1>

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

              {postFormatted.data.content.map(({ heading, body }) => {
                return (
                  <section key={heading}>
                    <h2>{heading}</h2>
                    {body.map(({ text }, index) => (
                      <p key={index}>{text}</p>
                    ))}
                  </section>
                );
              })}
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
    lang: 'pt-BR',
  });

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});

  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug), {});
  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  };
};
