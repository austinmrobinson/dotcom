import { notFound } from "next/navigation";
import { getProject } from "@/app/utils/getProjects";
import { PostBody } from "./components/body";
import { Heading, Text } from "@/app/components/text";
import TopOfPage from "@/app/components/topOfPage";
import { formatDateMonth } from "@/app/utils/formatDate";
import Image from "next/image";
import { cookies } from "next/headers";
import PasswordForm from "@/app/components/passwordForm";
import { Suspense } from "react";
import ProjectPageLoading from "./loading";
import Animate from "@/app/components/animate";

export default async function ProjectPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const post = await getProject(params.slug);

  const cookiesStore = cookies();
  const loginCookies = cookiesStore.get(process.env.PASSWORD_COOKIE_NAME!);
  const isLoggedIn = !!loginCookies?.value;

  if (!isLoggedIn) {
    return <PasswordForm />;
  } else {
    if (!post) return notFound();
    return (
      <Suspense
        fallback={!isLoggedIn ? <PasswordForm /> : <ProjectPageLoading />}
      >
        <Animate className="flex flex-col gap-12">
          <TopOfPage title={post.title} back="/projects">
            <Text>{`${formatDateMonth(post.date)} • ${post.company} • ${
              post.role
            }`}</Text>
          </TopOfPage>
          <PostBody>{post?.body}</PostBody>
          {post.images && (
            <section className="flex flex-col gap-4">
              <Heading size="h3" as="h2">
                Gallery
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {post.images.map((item: any, index: number) => (
                  <Image
                    key={index}
                    width="256"
                    height="144"
                    src={item.src}
                    alt={item.alt}
                    className="rounded-xl w-full bg-neutral-900/10 dark:bg-neutral-100/10"
                  />
                ))}
              </div>
            </section>
          )}
          {post.categories && (
            <div className="flex flex-col gap-1">
              <Heading size="h6" as="h2">
                Categories
              </Heading>
              {post.categories && (
                <ul className="flex gap-2">
                  {post.categories.map((category: string, index: number) => (
                    <li
                      className="flex items-center justify-center h-8 p-3 rounded-full bg-neutral-100 border border-neutral-900/10 dark:bg-neutral-100/10 dark:border-neutral-100/10"
                      key={index}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Animate>
      </Suspense>
    );
  }
}
