import 'server-only';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const getModuleFlag = unstable_cache(
  async (key: string) => {
    const flag = await prisma.featureFlag.findUnique({
      where: { key },
    });

    return {
      isActive: flag?.isActive ?? false,
      visibleInOwner: flag?.ownerVisible ?? false,
      editableByOwner: flag?.ownerEditable ?? false,
      renderPublic: flag?.publicVisible ?? false,
    };
  },
  ['module-flag'],
  {
    revalidate: 60,
    tags: ['flags']
  }
);
