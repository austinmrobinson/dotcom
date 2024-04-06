export type Image = {
  src: string;
  alt: string;
};

export type Company = {
  title: string;
  subtitle: string;
  slug: string;
  startingDate: string;
  endingDate?: string;
  roles: Role[];
};

export type Category = {
  title: string;
  slug: string;
};

export type Role = {
  title: string;
  startingDate: string;
  endingDate: string;
};

export type Project = {
  title: string;
  date: string;
  subtitle: string;
  slug: string;
  company?: Company;
  role?: string;
  categories?: Category[];
  thumbnail: Image;
  images?: Image[];
};
