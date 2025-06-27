import React from 'react';

const posts = [
    {
        title: 'Tentang Creativity Block pada UI Designer',
        date: 'Maret 05, 2021',
        desc: 'Beberapa cara yang saya lakukan ketika tidak memiliki ide atau bingung untuk memulai design',
        img: 'https://i.postimg.cc/yYgJCZ5m/business.jpg', // placeholder, replace with your own
        featured: true,
    },
    {
        title: 'Memilih foto yang cocok untuk desain website',
        date: 'Maret 03, 2021',
        desc: 'Tips memilih foto yang cocok untuk desain website dan bagaimana cara menempatkan nya dengan tepat.',
        img: 'https://i.postimg.cc/SKwTV8wg/2.jpg',
    },
    {
        title: 'Membuat desain header yang proporsional',
        date: 'Februari 28, 2021',
        desc: 'Sadis! Tips untuk membuat desain bagian header pada website yang keren dan tidak terlalu terkesan ketinggalan.',
        img: 'https://i.postimg.cc/HkkhLTw9/3.jpg',
    },
    {
        title: 'Cara memakai inspirasi dari referensi',
        date: 'Februari 24, 2021',
        desc: 'Bagaimana saya biasanya mengambil inspirasi dari referensi pada desain, dengan sedikit modifikasi.',
        img: 'https://i.postimg.cc/5yJPWJ9v/4.jpg',
    },
    {
        title: 'Sebaiknya Belajar UI Design mulai dari mana?',
        date: 'Februari 20, 2021',
        desc: 'Tahapan belajar UI Design di tengah arus UI/UX yang kadang membingungkan.',
        img: 'https://i.postimg.cc/2S9XbgTR/5.jpg',
    },
    {
        title: 'Pertanyaan tentang terjun di industri UI/UX',
        date: 'Februari 21, 2021',
        desc: 'Menjawab beberapa pertanyaan dari teman-teman yang ingin terjun di industri UI/UX.',
        img: 'https://i.postimg.cc/8cbZ1YsY/6.jpg',
    },
    {
        title: 'Dari Website Programmer Menjadi UI Designer',
        date: 'Februari 18, 2021',
        desc: 'Perjalanan saya proses belajar menjadi UI Designer, beberapa tips bisa diikuti.',
        img: 'https://i.postimg.cc/FR3P6zvN/7.jpg',
    },
];

function page() {
    const featured = posts[0];
    const cards = posts.slice(1);

    return (
        <div className="min-h-screen bg-[#f6f7fb] px-4 py-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h1 className="text-5xl font-extrabold mb-12 text-gray-900 tracking-tight">Ai Blog</h1>

                {/* Featured Post */}
                <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
                    <div className="rounded-sm overflow-hidden bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center min-h-[240px]">
                        {/* Placeholder image or SVG */}
                        <img src={featured.img} alt="Featured" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm mb-2">{featured.date}</div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{featured.title}</h2>
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed">{featured.desc}</p>
                    </div>
                </div>

                {/* Blog Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {cards.map((post, idx) => (
                        <div key={idx} className="bg-white rounded-sm shadow hover:shadow-md duration-800 transition-all transform overflow-hidden flex flex-col hover:-translate-y-2">
                            <div className="bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center min-h-[140px]">
                                <img src={post.img} alt={post.title} className="w-full h-44 object-cover" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-gray-500 text-xs mb-2">{post.date}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{post.title}</h3>
                                <p className="text-gray-700 text-sm flex-1">{post.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default page;