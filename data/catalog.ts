import type { CartItem, Product } from '../types';

/**
 * The Ge'ez Digital catalog.
 *
 * Every entry maps 1:1 to a PDF in /public/products, generated from the
 * `output-global` source folder. Chapter lists are the guide's own outline, so
 * the product page never promises something the PDF does not contain.
 */

const PDF_BASE = '/products';

const WHOP_PRODUCT_SLUGS: Record<string, string> = {
  '01-first-500-dollars-online': 'the-first-500-online-7f',
  '02-freelancer-starter-system': 'freelancer-starter-system',
  '03-ai-income-system': 'ai-income-system-78',
  '04-social-media-manager-starter': 'social-media-manager-starter',
  '05-canva-to-cash': 'canva-to-cash-e7',
  '06-sell-digital-products': 'sell-digital-products-e5',
  '07-remote-work-starter': 'remote-work-starter',
  '08-content-income-system': 'content-income-system',
  '09-online-service-business': 'online-service-business',
  '10-digital-business-challenge': 'digital-business-challenge',
  'complete-library': 'membership-4dfa',
};

function guide(
  id: number,
  slug: string,
  rest: Omit<Product, 'id' | 'slug' | 'image' | 'file' | 'checkoutUrl'>,
): Product {
  return {
    id,
    slug,
    checkoutUrl: `https://whop.com/geez-digital/products/${WHOP_PRODUCT_SLUGS[slug]}/`,
    image: `/covers/${slug}.svg`,
    file: `${PDF_BASE}/${slug}.pdf`,
    ...rest,
  };
}

export const PRODUCTS: Product[] = [
  guide(1, '01-first-500-dollars-online', {
    name: 'The First $500 Online',
    tagline: 'A 30-day blueprint for your first dollar online',
    price: 5.99,
    category: 'Start Here',
    pages: 87,
    badge: 'Start here',
    description:
      'The honest starting point: where online money actually comes from in your country, how to price in dollars, and a 30-day calendar that ends with a paid client. Written for people with no audience, no budget and only a phone to work from.',
    outcomes: [
      'Score five realistic online income options against your skills, hours and payment access',
      'Assemble a zero-budget offer — plus proof you can show before you have a single client',
      'Price and invoice in dollars, then collect the money without a foreign company',
      'Run the 30-day calendar: prospect list, outreach, follow-up and the first payment',
    ],
    chapters: [
      'Where the money actually comes from where you live',
      'The opportunity score',
      'Zero-budget setup',
      'Your offer',
      'Proof without clients',
      'Pricing in dollars',
      'Finding prospects',
      'Outreach that gets replies',
      'Delivery and getting paid',
      'The 30-day calendar',
      'Testimonials, repeat business and reinvesting',
      'How $500 actually looks in real life',
    ],
    includes: [
      '87-page PDF, 12 chapters and a closing FAQ',
      'The opportunity score worksheet',
      'Outreach scripts that ask for a reply, not a favour',
      'Pricing table and a payment checklist',
    ],
    tags: ['Beginner', 'Pricing', 'Outreach', 'Payments'],
  }),

  guide(2, '02-freelancer-starter-system', {
    name: 'Freelancer Starter System',
    tagline: 'From zero clients to a booked calendar',
    price: 7.99,
    category: 'Freelance & Remote',
    pages: 88,
    description:
      'A complete freelancing system for people outside the usual hiring markets: pick a skill and a niche, build a profile that sells outcomes instead of a CV, assemble a portfolio with no clients, and run the 14-day launch plan.',
    outcomes: [
      'Choose a skill and niche that buyers can actually search for',
      'Build three portfolio proof pieces without a single client',
      'Send the ten proposals and handle the four objections that block deals',
      'Deliver, invoice and turn one client into repeat work',
    ],
    chapters: [
      'What freelancing from your country actually is',
      'Choose your skill and your niche',
      'Your profile: sell the outcome, not the CV',
      'A portfolio without clients',
      'Finding work: four channels that produce buyers',
      'Proposals and outreach: ten scripts you can use today',
      'Objections, negotiation and closing',
      'Delivering work and getting paid',
      'Turning one client into many',
      'The 14-day launch plan',
    ],
    includes: [
      '88-page PDF, 10 chapters and a closing FAQ',
      'Ten copy-and-edit proposal scripts',
      'Briefs for your first three portfolio pieces',
      'Objection and negotiation cheat sheet',
    ],
    tags: ['Freelancing', 'Proposals', 'Portfolio', 'Payments'],
  }),

  guide(3, '03-ai-income-system', {
    name: 'AI Income System',
    tagline: 'Sell AI-assisted work that does not sound like a robot',
    price: 9.99,
    category: 'AI & Design',
    pages: 99,
    badge: 'New',
    description:
      'How to use AI as a production line rather than a gimmick: what it can and cannot sell, a repeatable workflow, prompts for people who are not engineers, quality control, and eleven use cases worked end to end for local businesses.',
    outcomes: [
      'Run a repeatable production workflow from client brief to delivered file',
      'Write prompts that survive a client review',
      'Edit AI output until nobody can hear the machine',
      'Package, price and sell AI-assisted services without falling into the free-sample trap',
    ],
    chapters: [
      'What AI can and cannot sell',
      'The production workflow',
      'Prompt engineering for people who are not engineers',
      'Quality control: the part that gets you rehired',
      'Editing so it does not sound like AI',
      'Packaging and pricing the services',
      'Finding buyers',
      'Selling it: outreach, samples and the free-sample trap',
      'Delivery, payment and the business around it',
      'A 14-day implementation plan',
      'Local use cases, worked end to end',
    ],
    includes: [
      '99-page PDF, 11 chapters and a closing FAQ',
      'Prompt library written for non-engineers',
      'Quality-control checklist to run before delivery',
      'A 14-day implementation plan',
    ],
    tags: ['AI', 'Prompts', 'Services', 'Pricing'],
  }),

  guide(4, '04-social-media-manager-starter', {
    name: 'Social Media Manager Starter',
    tagline: 'Run content for local businesses, get paid monthly',
    price: 7.99,
    category: 'Content & Social',
    pages: 89,
    description:
      'The retainer business hiding in every neighbourhood: which local businesses actually need a social manager, the audit that gets you in the door, a content system that fits a small business, and monthly reporting that keeps clients paying.',
    outcomes: [
      'Audit a local business profile in 30 minutes and turn it into a pitch',
      'Build a 30-day content calendar and a content bank that survives a bad week',
      'Produce mobile-first posts and short video on a low-data budget',
      'Package, price and report a monthly retainer in dollars',
    ],
    chapters: [
      'Which local businesses actually need this, and which do not',
      'The audit: your free foot in the door',
      'Content strategy that fits a small local business',
      'The content calendar and the content bank',
      'Mobile-first, low-data production',
      'Captions, graphics and short video that get engagement',
      'Telegram, the underrated channel',
      'Reporting and retention',
      'Packages and pricing in dollars',
      'Prospecting, outreach and onboarding',
    ],
    includes: [
      '89-page PDF, 10 chapters and a closing FAQ',
      'Audit template and a 30-day content calendar',
      'Caption and short-video formulas',
      'Reporting template that renews contracts',
    ],
    tags: ['Social media', 'Retainers', 'Local business', 'Reporting'],
  }),

  guide(5, '05-canva-to-cash', {
    name: 'Canva to Cash',
    tagline: 'Design services without a design degree',
    price: 5.99,
    category: 'AI & Design',
    pages: 76,
    description:
      'Design is the easiest service to sell and the easiest one to be embarrassed by. Learn the ten things local clients actually buy, the fundamentals that separate amateur from professional, and a fourteen-day portfolio launch.',
    outcomes: [
      'Produce the ten design deliverables local clients actually pay for',
      'Apply the fundamentals: hierarchy, spacing, colour and restraint',
      'Build a ten-piece portfolio from scratch',
      'Price ten sample packages and manage revisions without losing your margin',
    ],
    chapters: [
      'The ten things local clients actually buy',
      'Design fundamentals that separate amateur from professional',
      'The design workflow in a free tool, from phone and from laptop',
      'Your portfolio: ten pieces, no clients',
      'Pricing and ten sample service packages',
      'Revisions, feedback and not going crazy',
      'Finding local clients',
      'Outreach that works for design',
      'Client management, delivery and getting paid',
      'A fourteen-day portfolio launch plan',
    ],
    includes: [
      '76-page PDF, 10 chapters and a closing FAQ',
      'Ten sample service packages with prices',
      'A revisions and feedback policy you can send clients',
      'A fourteen-day portfolio plan',
    ],
    tags: ['Design', 'Canva', 'Portfolio', 'Pricing'],
  }),

  guide(6, '06-sell-digital-products', {
    name: 'Sell Digital Products',
    tagline: 'Find a problem, build the fix, get paid',
    price: 11.99,
    category: 'Products & Services',
    pages: 99,
    badge: 'Bestseller',
    description:
      'The nine kinds of digital product, how to validate demand before you build, how to write a sales page that converts without an audience, and the delivery, licensing and refunds that keep you out of trouble.',
    outcomes: [
      'Validate a product idea before you spend a weekend building it',
      'Build, name and price a product people can buy in one click',
      'Write a sales page that works with no followers to seed it',
      'Handle delivery, support, refunds, copyright and licensing properly',
    ],
    chapters: [
      'The nine product types, and which one fits you',
      'Finding a problem worth paying for',
      'Validating demand before you build',
      'Building the product',
      'Naming, pricing and the sales page',
      'Getting paid where you live: the honest, verified chapter',
      'Delivery, customer support and refunds',
      'Copyright, licensing and not getting into trouble',
      'Selling without an audience',
      'Scaling: the second product, the bundle, version two',
    ],
    includes: [
      '99-page PDF, 10 chapters and a closing FAQ',
      'Nine product types with fit criteria',
      'A validation checklist to run before you build',
      'Pricing, licensing and refund templates',
    ],
    tags: ['Digital products', 'Validation', 'Sales pages', 'Payments'],
  }),

  guide(7, '07-remote-work-starter', {
    name: 'Remote Work Starter',
    tagline: 'Land a remote role from anywhere',
    price: 7.99,
    category: 'Freelance & Remote',
    pages: 100,
    description:
      'A remote job search built for candidates outside the hiring country: the roles that are genuinely open, a CV that survives screening, interview practice, time-zone etiquette, and how to get paid by a foreign employer.',
    outcomes: [
      'Map your skills onto roles that hire remotely and pay in dollars',
      'Rewrite your CV and profile around the outcomes a remote employer buys',
      'Apply through channels that produce interviews instead of silence',
      'Interview, onboard and get paid across time zones',
    ],
    chapters: [
      'The remote-work reality for locals',
      'Choose your role from your skills',
      'The remote-ready CV',
      'Your professional profile and proof',
      'Finding and applying to remote work',
      'The remote interview',
      'Remote work etiquette and communication',
      'Time zones, schedule and reliability',
      'Getting paid by a foreign employer',
      'From freelance to remote, and the two plans',
    ],
    includes: [
      '100-page PDF, 10 chapters and a closing FAQ',
      'Remote-ready CV and profile patterns',
      'Interview question bank with answer structures',
      'Payment routes for foreign employers',
    ],
    tags: ['Remote work', 'CV', 'Interviews', 'Payments'],
  }),

  guide(8, '08-content-income-system', {
    name: 'Content Income System',
    tagline: 'Six paths from audience to income',
    price: 9.99,
    category: 'Content & Social',
    pages: 99,
    description:
      'Followers are not income. This guide lays out six honest monetisation paths — services, products, sponsorship, lead generation, community and consulting — plus the content system that feeds them, with Telegram as the home base.',
    outcomes: [
      'Choose the monetisation path that fits the audience you can actually grow',
      'Build content pillars, hooks and formats you can sustain for months',
      'Publish consistently on a slow connection with a small phone',
      'Convert attention into paid work without burning the audience',
    ],
    chapters: [
      'Why followers are not income',
      'Niche, positioning and profile',
      'Content pillars, hooks and formats',
      'Publishing consistently on a slow connection',
      'Paths one and two: service and digital product',
      'Paths three and four: sponsorships and lead generation',
      'Paths five and six: community and consulting',
      'Telegram as the home base',
      'Protecting yourself: reputation, copyright and platform rules',
      'The 30-day build',
    ],
    includes: [
      '99-page PDF, 10 chapters and a closing FAQ',
      'Six monetisation paths compared side by side',
      'Content pillar and hook worksheet',
      'A 30-day publishing build',
    ],
    tags: ['Content', 'Audience', 'Monetisation', 'Telegram'],
  }),

  guide(9, '09-online-service-business', {
    name: 'Online Service Business',
    tagline: 'Ten services local businesses actually buy',
    price: 14.99,
    category: 'Products & Services',
    pages: 101,
    badge: 'Bestseller',
    description:
      'Ten services that sell in almost any city — pages, design, video, being found, catalogues, customer support, writing, AI-assisted documents and more — with pricing, delivery systems and the thirty days that turn it into a business rather than odd jobs.',
    outcomes: [
      'Pick two services from the ten that fit your skills and your market',
      'Sell them the way local businesses actually buy: outcome, price, proof',
      'Build delivery systems so you can carry more than one client',
      'Price, invoice and scale into a small service business',
    ],
    chapters: [
      'The service-business model, and why it beats gig work',
      'How local businesses actually buy',
      'The ten services, at a glance',
      'Services one to three: pages, design and video',
      'Services four and five: being found, and the one-page site',
      'Services six and seven: catalogues and customer support',
      'Services eight to nine: writing, and AI-assisted documents',
      'Service ten, and the systems that hold everything together',
      'Building the business around the service',
      'Scaling, and your first thirty days',
    ],
    includes: [
      '101-page PDF, 10 chapters and a closing FAQ',
      'Ten services with pricing guidance',
      'Client onboarding and delivery systems',
      'Your first thirty days, mapped',
    ],
    tags: ['Services', 'Sales', 'Delivery', 'Scaling'],
  }),

  guide(10, '10-digital-business-challenge', {
    name: 'Digital Business Challenge',
    tagline: '30 days from idea to first payment',
    price: 5.99,
    category: 'Start Here',
    pages: 69,
    description:
      'The short version, built as a challenge: eight stages from choosing a market to the finish, each with one deliverable. Read it in a weekend, execute it in a month, and stop collecting theory.',
    outcomes: [
      'Pick a market and a problem in the first two days',
      'Build an offer and proof that survives the price question',
      'Run outreach and proposals with a closing structure',
      'Deliver, get paid and collect the testimonial that starts the next cycle',
    ],
    chapters: [
      'Choose your market',
      'Choose your problem and your service',
      'Build the offer and the proof',
      'Build the prospect list',
      'Outreach',
      'Proposals, negotiation and closing',
      'Delivery',
      'Payment, testimonials and the finish',
    ],
    includes: [
      '69-page PDF, 8 challenge stages and a closing FAQ',
      'Weekly checkpoint checklist',
      'Proposal and closing structure',
      'A first-payment scorecard',
    ],
    tags: ['Challenge', 'Beginner', 'Outreach', 'Delivery'],
  }),
];

const BUNDLE_BASE = {
  id: 100,
  slug: 'complete-library',
  checkoutUrl: `https://whop.com/geez-digital/products/${WHOP_PRODUCT_SLUGS['complete-library']}/`,
  name: 'The Complete Library',
  tagline: 'All ten playbooks, 907 pages, one download',
  price: 39.99,
  compareAt: 88.9,
  category: 'Start Here' as const,
  image: '/covers/complete-library.svg',
  file: '',
  pages: 907,
  badge: 'Best value',
  isBundle: true,
  description:
    'Every guide in the Ge\u2019ez Digital library in one purchase: the beginner start, freelancing, AI services, social management, design, digital products, remote work, content income, a full service business and the 30-day challenge. Lifetime access, free updates to every edition.',
  outcomes: [
    'The whole ladder: first $500, then a freelance or service business, then products and content',
    '907 pages across ten guides, each one readable in a single sitting',
    'Every template, script and checklist from all ten books',
    'Free updates to every edition, forever',
  ],
  chapters: PRODUCTS.map((p) => p.name),
  includes: [
    'All 10 PDFs (907 pages), downloadable individually',
    'Every template, script and checklist in the library',
    'Free updates when any edition is revised',
    '30-day money-back guarantee',
  ],
  tags: ['Bundle', 'All ten guides', 'Best value'],
};

export const BUNDLE: Product = BUNDLE_BASE;

/** Everything that can be bought, including the bundle. */
export const ALL_PRODUCTS: Product[] = [...PRODUCTS, BUNDLE];

export const TOTAL_PAGES = PRODUCTS.reduce((sum, p) => sum + p.pages, 0);

/** Files a purchase grants, expanding a bundle into its ten guides. */
export function filesForProduct(product: Product): Product[] {
  return product.isBundle ? PRODUCTS : [product];
}

export function findProduct(idOrSlug: number | string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function toCartItem(product: Product, quantity = 1): CartItem {
  return { ...product, quantity };
}

/** Digital licences are one per reader; the cart never stacks quantities. */
export function addToCart(items: CartItem[], product: Product): CartItem[] {
  if (items.some((item) => item.id === product.id)) return items;
  return [...items, toCartItem(product)];
}

export const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatUSD(amount: number): string {
  return USD.format(amount);
}

export const FREE_INDEX = {
  name: 'The Library Index (free)',
  file: '/products/library-index-sample.pdf',
  pages: 6,
};
