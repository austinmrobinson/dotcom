import { notFound } from "next/navigation";
import { getProjects } from "@/app/utils/getProjects";
import { PostBody } from "./components/body";
import { Heading, Text } from "@/app/components/text";
import TopOfPage from "@/app/components/topOfPage";
import { formatDateMonth } from "@/app/utils/formatDate";
import { cookies } from "next/headers";
import PasswordForm from "@/app/components/passwordForm";
import { Suspense } from "react";
import ProjectPageLoading from "./loading";
import Animate from "@/app/components/animate";
import ImageZoom, { ImageZoomGallery } from "@/app/components/image";
import { Metadata } from "next";
import { newGetProjects } from "@/app/utils/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectPage({ params }: any) {
  // let projects = await newGetProjects();
  // let project = projects?.find(
  //   (project) => project.metadata.slug === params.slug
  // );

  // const cookiesStore = cookies();
  // const loginCookies = cookiesStore.get(process.env.PASSWORD_COOKIE_NAME!);
  // const isLoggedIn = !!loginCookies?.value;

  return <div>{params.slug}</div>;
}
//   if (!isLoggedIn) {
//     return <PasswordForm />;
//   } else {
//     if (!project) return notFound();
//     return (
//       <Suspense
//         fallback={!isLoggedIn ? <PasswordForm /> : <ProjectPageLoading />}
//       >
//         <Animate className="flex flex-col gap-12">
//           <TopOfPage title={project.metadata.title} back="/projects">
//             <Text>{`${formatDateMonth(project.metadata.date)} • ${
//               project.metadata.company
//             } • ${project.metadata.role}`}</Text>
//           </TopOfPage>
//           <ImageZoom
//             src={project.metadata.thumbnail.src}
//             alt={project.metadata.thumbnail.alt}
//             className="w-full rounded-none md:rounded-xl bg-neutral-900/10 dark:bg-white/10"
//             buttonClassName="max-w-[767px] w-[100vw] self-center"
//           />
//           <PostBody>{project?.content}</PostBody>
//           {/* {project.metadata.images && (
//             <section className="flex flex-col gap-4">
//               <Heading size="h3" as="h2">
//                 Gallery
//               </Heading>
//               <ImageZoomGallery images={project.metadata.images} />
//             </section>
//           )} */}
//           {/* {project.metadata.categories && (
//             <div className="flex flex-col gap-2">
//               <Heading size="h5" as="h2">
//                 Categories
//               </Heading>
//               {project.metadata.categories && (
//                 <ul className="flex gap-2">
//                   {project.metadata.categories.map(
//                     (category: string, index: number) => (
//                       <li
//                         className="flex items-center justify-center px-3 py-1 rounded-full bg-neutral-100 border border-neutral-900/5 dark:bg-neutral-100/10 dark:border-neutral-100/5"
//                         key={index}
//                       >
//                         {category}
//                       </li>
//                     )
//                   )}
//                 </ul>
//               )}
//             </div>
//           )} */}
//         </Animate>
//       </Suspense>
//     );
//   }
// }
