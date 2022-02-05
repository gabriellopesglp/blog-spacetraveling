import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../../styles/common.module.scss';
import { formatedData, formatedDataTime, readingTime } from '../../util/format';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Comments from '../../components/Comments';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
      alt: string;
    };
    banner_position_v: string;
    banner_position_h: string;
    thumbnail: string;
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
      markdown: string;
    }[];
  };
}

interface Navigation {
  prevPost: {
    uid: string;
    data: {
      title: string;
    };
  }[];
  nextPost: {
    uid: string;
    data: {
      title: string;
    };
  }[];
}

interface PostProps {
  post: Post;
  navigation: Navigation;
  preview: boolean;
}

export default function Post({ post, navigation, preview }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1 className={styles.loading}>Carregando...</h1>
  }

  var hasEdit = false;

  if (post.first_publication_date !== post.last_publication_date) {
    hasEdit = true;
  } else {
    hasEdit = false;
  }



  return (
    <>
      <Head>
        <title>{`${post.data.title} | </>spacetraveling.`}</title>

        <meta name="description" content={post.data.subtitle} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://desafio-05-trilha-reactjs.vercel.app/post/${post.uid}`} />
        <meta property="og:title" content={`${post.data.title} | </>spacetraveling.`} />
        <meta property="og:description" content={post.data.subtitle} />
        <meta property="og:image" content={post.data.thumbnail} />
        <meta property="og:image:type" content="image/jpg" />

        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://desafio-05-trilha-reactjs.vercel.app/post/${post.uid}`} />
        <meta property="twitter:title" content={`${post.data.title} | </>spacetraveling.`} />
        <meta property="twitter:description" content={post.data.subtitle} />
        <meta property="twitter:image" content={post.data.thumbnail} />
      </Head>
      <Header />
      <img className={styles.banner} style={{ objectPosition: `${post.data.banner_position_v}% ${post.data.banner_position_h ? post.data.banner_position_h : ''}%` }} src={post.data.banner.url} alt={post.data.banner.alt} />
      <main className={commonStyles.container}>
        <div className={styles.post}>
          <h1>{post.data.title}</h1>
          <em>"{post.data.subtitle}"</em>
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

          {hasEdit && (
            <em>* editado em {formatedDataTime({ newDate: post.last_publication_date })}</em>
          )
          }

          {post.data.content.map(content => {
            return (
              <article className={`${styles.postContent} ${content.heading ? '' : styles.hasNotHeading}`} key={content.heading ? content.heading : Math.random()}>
                {content.heading ? <h2>{content.heading}</h2> : ''}
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body)
                  }}
                />

                <ReactMarkdown
                  children={content.markdown}
                  components={{
                    code({ inline, className, children }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, '')}
                          style={dracula}
                          language={match[1]}
                          PreTag="div"
                        />
                      ) : (
                        <code className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                />
              </article>
            )
          })}
        </div>

        <section className={styles.navigation}>
          {navigation?.prevPost.length > 0 ? (
            <div>
              <h3>{navigation.prevPost[0].data.title}</h3>
              <Link href={`/post/${navigation.prevPost[0].uid}`}>
                <a>Post anterior</a>
              </Link>
            </div>
          ) : <div />}

          {navigation?.nextPost.length > 0 && (
            <div>
              <h3>{navigation.nextPost[0].data.title}</h3>
              <Link href={`/post/${navigation.nextPost[0].uid}`}>
                <a>Próximo post</a>
              </Link>
            </div>
          )}

        </section>

        <Comments />

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

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  return {
    paths: [
      { params: { slug: posts.results[0].uid } },
      // { params: { slug: posts.results[1].uid } }
    ],
    fallback: true
  }


};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData
}) => {
  const { slug } = params;
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref ?? null,
  });

  const baseUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://desafio-05-trilha-reactjs.vercel.app';

  const titleReplaced = response.data.title.replace(/[+]/g, '%2b');

  const thumbnailUrl = `${baseUrl}/api/thumbnail.png?title=${titleReplaced}`;
  const bannerUrl = `${baseUrl}/api/banner.png?title=${titleReplaced}`;

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url ?? bannerUrl,
        alt: response.data.banner.alt ?? "Banner do artigo"
      },
      banner_position_v: response.data.banner_position_v ?? '0',
      banner_position_h: response.data.banner_position_h ?? null,
      thumbnail: thumbnailUrl,
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
          markdown: RichText.asText(content.markdown) ?? null,
        }
      }),
    }
  };

  const prevPost = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ], {
    pageSize: 1,
    after: response.id,
    orderings: '[document.first_publication_date]'
  });

  const nextPost = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ], {
    pageSize: 1,
    after: response.id,
    orderings: '[document.first_publication_date desc]'
  });



  return {
    props: {
      post,
      navigation: {
        prevPost: prevPost?.results,
        nextPost: nextPost?.results
      },
      preview
    },
    revalidate: 60 * 60, // 1 hour
  }
}
