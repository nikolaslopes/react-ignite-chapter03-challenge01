import { GetStaticProps } from 'next';
import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Post from './post/[slug]';

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

export default function Home() {
  return (
    <>
      <main className={commonStyles.mainContainer}>
        <Header />
        <section className={commonStyles.contentBox}>
          <div className={styles.postContent}>
            <h1>Como utilizar hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.postFooter}>
              <time>
                <FiCalendar /> 15 Mar 2021
              </time>
              <small>
                <FiUser /> Nikolas Lopes
              </small>
            </div>
          </div>

          <footer className={styles.pageAction}>
            <button type="button">Carregar mais posts</button>
          </footer>
        </section>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
