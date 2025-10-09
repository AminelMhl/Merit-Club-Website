// Global image preloader for team member images
export const preloadTeamImages = () => {
  const teamImagePaths = [
    "/team/azza.jpg",
    "/team/tasnim.jpg",
    "/team/medomar.jpg",
    "/team/ameni.jpg",
    "/team/arij.jpg",
    "/team/fedi.jpg",
    "/team/ata.jpg",
    "/team/hansoo.png",
  ];

  const preloadPromises = teamImagePaths.map((path) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload team image: ${path}`);
        resolve(); // Still resolve to not block
      };
      img.src = path;
    });
  });

  return Promise.all(preloadPromises);
};

// Preload other critical images
export const preloadCriticalImages = () => {
  const criticalImages = [
    "/Hero.png",
    "/aboutImages.png",
    "/bck.png",
    "/circle.svg",
    "/logo2.png",
  ];

  const preloadPromises = criticalImages.map((path) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload critical image: ${path}`);
        resolve();
      };
      img.src = path;
    });
  });

  return Promise.all(preloadPromises);
};
