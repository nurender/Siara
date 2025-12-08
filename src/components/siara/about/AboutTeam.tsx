"use client";
import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin?: string;
  instagram?: string;
}

interface AboutTeamProps {
  settings?: Record<string, string>;
}

const defaultTeam: TeamMember[] = [
  {
    name: "Rajesh Sharma",
    role: "Founder & Creative Director",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    bio: "20+ years in luxury hospitality. Former Taj Hotels executive turned wedding visionary.",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Priya Mehta",
    role: "Lead Wedding Designer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    bio: "Award-winning designer specializing in Rajasthani heritage aesthetics and contemporary fusion.",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Amit Verma",
    role: "Operations Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    bio: "Logistics expert managing 100+ weddings annually across Rajasthan's most prestigious venues.",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Kavita Singh",
    role: "Head of Client Relations",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    bio: "Dedicated to creating personalized experiences and ensuring every client feels like royalty.",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Vikram Rathore",
    role: "Udaipur Office Head",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    bio: "Native Udaipur expert with exclusive access to Lake Pichola's most coveted venues.",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Ananya Joshi",
    role: "Jodhpur Office Head",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80",
    bio: "Specialist in fort weddings and desert celebrations with deep Marwar cultural knowledge.",
    linkedin: "#",
    instagram: "#",
  },
];

export default function AboutTeam({ settings = {} }: AboutTeamProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);

  const badge = settings.about_team_badge || "";
  const title = settings.about_team_title || "";
  const highlight = settings.about_team_highlight || "";
  const description = settings.about_team_description || "";
  const teamNote = settings.about_team_note || "";

  useEffect(() => {
    // Fetch team members from CMS settings
    fetch(`${API_URL}/api/cms/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.about_team_members) {
          try {
            const teamMembers = typeof data.data.about_team_members === 'string' 
              ? JSON.parse(data.data.about_team_members) 
              : data.data.about_team_members;
            if (Array.isArray(teamMembers) && teamMembers.length > 0) {
              setTeam(teamMembers);
            }
          } catch (e) {
            console.error("Error parsing team members:", e);
          }
        }
      })
      .catch(err => console.error("Failed to fetch team members:", err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-siara-soft-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-siara-gold-100/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siara-purple-100/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-siara-gold-500"></span>
            <span className="font-dm-sans text-sm text-siara-purple-700 font-medium tracking-wide">
              {badge}
            </span>
          </div>
          <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-siara-purple-950 mb-6">
            {title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-siara-gold-600 to-siara-gold-400">
              {highlight}
            </span>
          </h2>
          <p className="font-dm-sans text-lg text-siara-purple-700/70 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-siara-purple-100/30 hover:shadow-2xl hover:shadow-siara-purple-200/40 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${member.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-siara-purple-950/90 via-siara-purple-950/20 to-transparent"></div>

                {/* Social Links */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={member.linkedin}
                    className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-siara-gold-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a
                    href={member.instagram}
                    className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-siara-gold-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                    </svg>
                  </a>
                </div>

                {/* Name & Role overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-cormorant text-2xl font-semibold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="font-dm-sans text-sm text-siara-gold-400">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="p-6">
                <p className="font-dm-sans text-sm text-siara-purple-600/80 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Team size note */}
        <div
          className={`mt-12 text-center transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="font-dm-sans text-siara-purple-600">
            {teamNote}
          </p>
        </div>
      </div>
    </section>
  );
}

