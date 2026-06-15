'use client';

import { useState, useEffect } from 'react';
import { fetchSanity } from '@/lib/sanity';
import { SKILLS_QUERY } from '@/lib/sanity-queries';
import type { Skill } from '@/types/sanity';
import { t } from '@/lib/i18n';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSanity<Skill[]>(SKILLS_QUERY)
      .then(data => { if (Array.isArray(data)) setSkills(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <section id="tecnologias" className="py-12"><p className="text-muted-foreground">{t().common.loading}</p></section>;
  if (!skills.length) return null;

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section id="tecnologias" className="py-12">
      <h2 className="text-3xl font-bold mb-8">{t().sections.skills}</h2>
      <Tabs defaultValue={categories[0]}>
        <TabsList className="mb-6 flex-wrap">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))}
        </TabsList>
        {categories.map(cat => (
          <TabsContent key={cat} value={cat}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.filter(s => s.category === cat).map(skill => (
                <Card key={skill._id} className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}/5</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-brand-600 dark:bg-brand-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
