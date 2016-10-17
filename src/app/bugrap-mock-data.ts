import * as moment from 'moment';
import { BugrapTicketPriority, BugrapTicketType, BugrapTicketStatus, BugrapTicket } from './bugrap-ticket';

export function getUserNames(): string[] {
  return [ 'Marc Manager', 'Hank Backwoodling', 'Joe Employee', 'Lucie Customer' ];
}

export function getProjectsNames(): string[] {
  return [
    'Project name that is rather long pellentesque habitant mobi',
    'Yet Another Project (CLOSED, DO NOT USE)',
    'The Phoenix Project',
    'Project Alpha',
    "Project Beta (cause it's beta than nothing)",
    'Project Gamma',
    'Project Delta',
    'Project Epsilon',
    'Project Omega'
  ];
}

export function getProjectVersions(project: string): string[] {
  if (project == 'The Phoenix Project') {
    return [ 'alpha', 'beta' ];
  }
  if (project == 'Yet Another Project (CLOSED, DO NOT USE)') {
    return [ 'the only version' ];
  }
  return [ '1.2.3-pre12', '1.3' ];
}

export function getTickets(): BugrapTicket[] {
  return <BugrapTicket[]> [
    {
      id: "p0-v0-a0-t0",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority5,
      summary: "[Long description] Panel child component is invalid",
      description: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek, then she continued her way. On her way she met a copy. The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything that was left from its origin would be the word \"and\" and the Little Blind Text should turn around and return to its own, safe country. But nothing the copy said could convince her and so it didn’t take long until a few insidious Copy Writers ambushed her, made her drunk with Longe and Parole and dragged her into their agency, where they abused her for their projects again and again. And if she hasn’t been rewritten, then they are still using her.Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline",
      reported: moment().subtract(15, 'minutes').toDate(),
      last_modified: null,
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager",
      comments: [],
      attachments: []
    },
    {
      id: "p0-v0-a0-t1",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.WorksForMe,
      priority: BugrapTicketPriority.Priority3,
      summary: "Menubar \"bottleneck\" usability problem",
      description: "At its current state, the MenuBar component has a severe usability problem, called the \"bottleneck in hierarchical menus\" by Bruce Tognazzini already back in 1999. It can be demonstrated with the \"Basic MenuBar\" demo from the sampler:\n\n1. Click \"File\"\n2. Move mouse pointer over to \"New\" - a submenu with three items opens.\n3. Move mouse pointer to \"Project...\" in the submenu\n4. Unless you moves your mouse pointer very carefully through the \"bottleneck\" marked with the arrow, the submenu probably closed when \"Open file...\" item captured the focus.\n\nProposed fix: use the original design described by Bruce \"Tog\" Tognazzini. See the specs and an entertaining read at Question 6, http://www.asktog.com/columns/022DesignedToGiveFitts.html.",
      reported: moment().subtract(2, 'hours').toDate(),
      last_modified: moment().subtract(30, 'minutes').toDate(),
      reported_by: "Hank Backwoodling",
      assigned_to: "Marc Manager",
      comments: [
        {
          created: moment().subtract(1, 'hours').toDate(),
          created_by: "Marc Manager",
          description: "What am I supposed to do with this?"
        },
        {
          created: moment().subtract(45, 'minutes').toDate(),
          created_by: "Hank Backwoodling",
          description: "Fix it as soon as possible.\nIf you need more information, please feel free to contact your local telepathy expert.\n\nBR,\nHank"
        }
      ],
      attachments: [
        { name: 'Ext JS menubar screenshot.png', url: '/' },
        { name: 'Loremipsum.pdf', url: '/' },
        { name: 'ZK screenshot.png', url: '/' }
      ]
    },
    {
      id: "p0-v0-a0-t2",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Feature,
      status: BugrapTicketStatus.CantFix,
      priority: BugrapTicketPriority.Priority2,
      summary: "Improve layout support",
      description: "Not much to say here",
      reported: moment().subtract(6, 'days').toDate(),
      last_modified: null,
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager",
      comments: [],
      attachments: []
    },
    {
      id: "p0-v0-a0-t3",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Duplicate,
      priority: BugrapTicketPriority.Priority4,
      summary: "Fix chrome theme identifier",
      description: "Some random glitch?",
      reported: moment().subtract(1, 'month').toDate(),
      last_modified: moment().subtract(2, 'weeks').toDate(),
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager",
      comments: [],
      attachments: []
    },
    {
      id: "p0-v0-a1-t0",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Fixed,
      priority: BugrapTicketPriority.Priority5,
      summary: "Far far away, behind the word mountains",
      description: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
      reported: moment().subtract(10, 'hours').toDate(),
      last_modified: null,
      reported_by: "Lucie Customer",
      assigned_to: null,
      comments: [],
      attachments: []
    },
    {
      id: "p0-v0-a1-t1",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Invalid,
      priority: BugrapTicketPriority.Priority3,
      summary: "A small river named Duden flows by their place",
      description: "A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.",
      reported: moment().subtract(6, 'hours').toDate(),
      last_modified: moment().subtract(5, 'hours').toDate(),
      reported_by: "Hank Backwoodling",
      assigned_to: "Hank Backwoodling",
      comments: [
        {
          created: moment().subtract(5, 'hours').toDate(),
          created_by: "Hank Backwoodling",
          description: "Yes, this is still relevant."
        }
      ],
      attachments: [
        { name: 'Far far away.webm', url: '/' }
      ]
    },
    {
      id: "p0-v0-a1-t2",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Feature,
      status: BugrapTicketStatus.NeedsMoreInformation,
      priority: BugrapTicketPriority.Priority1,
      summary: "The Big Oxmox advised her not to do so",
      description: "The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen.",
      reported: moment().subtract(32, 'hours').toDate(),
      last_modified: null,
      reported_by: "Marc Manager",
      assigned_to: null,
      comments: [],
      attachments: []
    },
    {
      id: "p0-v0-a1-t3",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority2,
      summary: "She packed her seven versalia",
      description: "She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane.",
      reported: moment().subtract(3, 'weeks').toDate(),
      last_modified: moment().subtract(2, 'weeks').toDate(),
      reported_by: "Lucie Customer",
      assigned_to: "Lucie Customer",
      comments: [],
      attachments: []
    },
    {
      id: "p0-v1-a0-t0",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.3",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority5,
      summary: "[Long description] Panel child component is invalid",
      description: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek, then she continued her way. On her way she met a copy. The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything that was left from its origin would be the word \"and\" and the Little Blind Text should turn around and return to its own, safe country. But nothing the copy said could convince her and so it didn’t take long until a few insidious Copy Writers ambushed her, made her drunk with Longe and Parole and dragged her into their agency, where they abused her for their projects again and again. And if she hasn’t been rewritten, then they are still using her.Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline",
      reported: moment().subtract(32, 'minutes').toDate(),
      last_modified: null,
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager",
      comments: [],
      attachments: []
    },
    {
      id: "p0-v1-a0-t1",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.3",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.WorksForMe,
      priority: BugrapTicketPriority.Priority3,
      summary: "Pityful a rethoric question ran over her cheek",
      description: "Pityful a rethoric question ran over her cheek, then she continued her way. On her way she met a copy. The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything that was left from its origin would be the word \"and\" and the Little Blind Text should turn around and return to its own, safe country",
      reported: moment().subtract(7, 'weeks').toDate(),
      last_modified: moment().subtract(7, 'weeks').toDate(),
      reported_by: "Hank Backwoodling",
      assigned_to: "Marc Manager",
      comments: [],
      attachments: []
    },
    {
      id: "p0-v1-a0-t2",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.3",
      type: BugrapTicketType.Feature,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority2,
      summary: "But nothing the copy said could convince her",
      description: "But nothing the copy said could convince her and so it didn’t take long until a few insidious Copy Writers ambushed her, made her drunk with Longe and Parole and dragged her into their agency, where they abused her for their projects again and again.",
      reported: moment().subtract(7, 'days').toDate(),
      last_modified: null,
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager",
      comments: [],
      attachments: []
    },
    {
      id: "p0-v1-a0-t3",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.3",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority4,
      summary: "And if she hasn’t been rewritten, then they are still using her.",
      description: "And if she hasn’t been rewritten, then they are still using her.Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
      reported: moment().subtract(1.5, 'month').toDate(),
      last_modified: moment().subtract(1.5, 'months').toDate(),
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager",
      comments: [],
      attachments: []
    },
    {
      id: "p0-v1-a1-t0",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.3",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority5,
      summary: "A wonderful serenity has taken possession of my entire soul",
      description: "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine.",
      reported: moment().subtract(12, 'hours').toDate(),
      last_modified: null,
      reported_by: "Lucie Customer",
      assigned_to: null,
      comments: [],
      attachments: []
    },
    {
      id: "p0-v1-a1-t1",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.3",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.WorksForMe,
      priority: BugrapTicketPriority.Priority3,
      summary: "I am so happy, my dear friend, so absorbed in the exquisite sense",
      description: "I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now.",
      reported: moment().subtract(7, 'hours').toDate(),
      last_modified: moment().subtract(2, 'hours').toDate(),
      reported_by: "Hank Backwoodling",
      assigned_to: "Hank Backwoodling",
      comments: [
        {
          created: moment().subtract(2, 'hours').toDate(),
          created_by: "Hank Backwoodling",
          description: "Yes, this is still relevant."
        }
      ],
      attachments: [
        { name: 'Far far away.webm', url: '/' }
      ]
    },
    {
      id: "p0-v1-a1-t2",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.3",
      type: BugrapTicketType.Feature,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority1,
      summary: "When, while the lovely valley teems with vapour around me",
      description: "When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream;",
      reported: moment().subtract(36, 'hours').toDate(),
      last_modified: null,
      reported_by: "Marc Manager",
      assigned_to: null,
      comments: [],
      attachments: []
    },
    {
      id: "p0-v1-a1-t3",
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.3",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority2,
      summary: "and, as I lie close to the earth, a thousand unknown plants are noticed",
      description: "and, as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies",
      reported: moment().subtract(4, 'weeks').toDate(),
      last_modified: moment().subtract(3, 'weeks').toDate(),
      reported_by: "Lucie Customer",
      assigned_to: "Lucie Customer",
      comments: [],
      attachments: []
    },
    {
      id: "p1-v0-a0-t0",
      project: "The Phoenix Project",
      version: "alpha",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority5,
      summary: "and then, my friend, when darkness overspreads my eyes",
      description: "and then, my friend, when darkness overspreads my eyes, and heaven and earth seem to dwell in my soul and absorb its power, like the form of a beloved mistress, then I often think with longing",
      reported: moment().subtract(42, 'minutes').toDate(),
      last_modified: null,
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager",
      comments: [],
      attachments: []
    },
    {
      id: "p1-v0-a0-t1",
      project: "The Phoenix Project",
      version: "beta",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.WorksForMe,
      priority: BugrapTicketPriority.Priority3,
      summary: "then I feel the presence of the Almighty",
      description: "then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love which bears and sustains us, as it floats around us in an eternity of bliss;",
      reported: moment().subtract(13, 'hours').toDate(),
      last_modified: moment().subtract(12, 'minutes').toDate(),
      reported_by: "Hank Backwoodling",
      assigned_to: "Marc Manager",
      comments: [
        {
          created: moment().subtract(12.5, 'hours').toDate(),
          created_by: "Marc Manager",
          description: "What am I supposed to do with this?"
        },
        {
          created: moment().subtract(12, 'hours').toDate(),
          created_by: "Hank Backwoodling",
          description: "Fix it as soon as possible.\nIf you need more information, please feel free to contact your local telepathy expert.\n\nBR,\nHank"
        }
      ],
      attachments: [
        { name: 'Ext JS menubar screenshot.png', url: '/' },
        { name: 'Loremipsum.pdf', url: '/' },
        { name: 'ZK screenshot.png', url: '/' }
      ]
    }
  ];
}
