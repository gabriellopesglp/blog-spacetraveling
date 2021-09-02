import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formatedData } from '../util/format';
import { useState } from 'react';

import Link from 'next/link';
import Header from '../components/Header';
import Head from 'next/head';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
    banner: {
      url: string;
      alt: string;
    };
  };
}

interface PostPagination {
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({ postsPagination, preview }: HomeProps) {
  const [hasNextPage, setHasNextPage] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  async function handleLoadPosts() {
    const postsResponse = await fetch(`${hasNextPage}`)
      .then(response => response.json());

    const newPosts = postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
          banner: {
            url: post.data.banner.url,
            alt: post.data.banner.alt,
          }
        }
      }
    });

    setPosts([...posts, ...newPosts]);
    setHasNextPage(postsResponse.next_page);
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <Header />

      <main className={commonStyles.container}>
        <section className={styles.postContainer}>
          <div className={styles.post}>
            {posts.map(post => (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a>
                  <img src={post.data.banner.url} alt={post.data.banner.alt} />
                  <div>
                    <strong>{post.data.title}</strong>
                    <p>{post.data.subtitle}</p>
                    <div className={commonStyles.info}>
                      <time>
                        <FiCalendar size={20} />
                        <p>{formatedData({ newDate: post.first_publication_date })}</p>
                      </time>
                      <div>
                        <FiUser size={20} />
                        <p>{post.data.author}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          {hasNextPage
            ? <button type="button" onClick={handleLoadPosts}> Carregar mais posts</button>
            : ''
          }
        </section>

        {preview && (
          <aside>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false, previewData }) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: [],
    pageSize: 3,
    ref: previewData?.ref ?? null,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
        banner: {
          url: post.data.banner.url,
          alt: post.data.banner.alt
        }
      }

    }
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts

  }

  return {
    props: {
      postsPagination,
      preview
    },
    revalidate: 60 * 30, // 30 minutes
  }
};
