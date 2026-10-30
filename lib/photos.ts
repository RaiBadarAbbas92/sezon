// Stock photos from Unsplash (free to use under the Unsplash License, hotlinked from their CDN).
// Swap any of these for your own product photos — a "/images/…" path works the same way.

// Unsplash resizes/compresses on its own CDN, so these images skip Next's optimizer (see ProductImage).
export const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const photos = {
  hero: unsplash("1638020522563-db439913b29f", 1400), // crochet teddy with coffee, warm cream tones
  maker: unsplash("1735414526594-a97524c7615d", 1000), // hands with a crochet hook
  sketch: unsplash("1732391928574-117e1d266084"), // pattern sketch + yarn
  finished: unsplash("1753370241583-82d8c84f0c6e"), // finished bunny with flowers
  categories: {
    amigurumi: unsplash("1755315897817-97bd6ec34256"),
    bags: unsplash("1787432131008-c754654978a4"),
    "home-decor": unsplash("1753366556699-4be495e5bdd6"),
    accessories: unsplash("1606772016409-d4a55e32be6e"),
    baby: unsplash("1602773974733-b56200c8653f"),
    gifts: unsplash("1707944145479-12755f0434d8"),
  } as Record<string, string>,
  instagram: [
    unsplash("1777537953560-10fda7d9965a"),
    unsplash("1753370230699-8e21227afeb6"),
    unsplash("1700171458554-46cfd3f2a87a"),
    unsplash("1686151271777-12efa81f65e0"),
    unsplash("1682954013913-25fe41e180c0"),
    unsplash("1728393287642-13bee7126ae8"),
  ],
};
