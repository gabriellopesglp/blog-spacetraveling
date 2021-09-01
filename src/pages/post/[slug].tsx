import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../../styles/common.module.scss';
import { formatedData, readingTime } from '../../util/format';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
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

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1 className={styles.loading}>Carregando...</h1>
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <Header />
      <img className={styles.banner} src={post.data.banner.url} alt={post.data.title} />
      <main className={commonStyles.container}>
        <div className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.info}>
            <time>
              <FiCalendar size={20} />
              <p>{formatedData({ newDate: post.first_publication_date })}</p>
            </time>
            <div>
              <FiUser size={20} />
              <p>{post.data.author}</p>
            </div>
            <div>
              <FiClock size={20} />
              <p>{readingTime({ content: post.data.content })} min</p>
            </div>
          </div>

          {post.data.content.map(content => {
            return (
              <article className={`${styles.postContent} ${content.heading ? '' : styles.hasNotHeading}`} key={content.heading ? content.heading : Math.random()}>
                {content.heading ? <h2>{content.heading}</h2> : ''}
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body)
                  }}
                />
              </article>
            )
          })}
        </div>
      </main>

    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
  ).then(function (response) {
    return response.results;
  }
  );

  return {
    paths: [
      { params: { slug: posts[0].uid } },
      { params: { slug: posts[1].uid } }
    ],
    fallback: true
  }


};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
        // alt: response.data.banner.alt
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        }
      }),
    }
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 60 * 2, // 2 hours
  }
}
