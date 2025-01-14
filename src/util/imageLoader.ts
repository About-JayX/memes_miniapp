import React from 'react';

const getProjectName = () => {
  return import.meta.env.MODE.split('-')[1] || 'memes';
};

export const getImage = (path: string, isShared: boolean = false): string => {
  if (isShared) {
    return `/image/${path}`;
  }
  return `/image/${getProjectName()}/${path}`;
};

interface ProjectImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path: string;
  isShared?: boolean;
}

export const ProjectImage: React.FC<ProjectImageProps> = ({ 
  path, 
  isShared = false, 
  ...props 
}) => {
  const src = getImage(path, isShared);
  return React.createElement('img', { src, ...props });
}; 