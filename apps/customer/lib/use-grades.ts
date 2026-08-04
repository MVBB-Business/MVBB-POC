"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@mvbb/api-client";
import type { PriceTier } from "@mvbb/pricing";

export interface LiveGrade {
  id: string;
  category: string;
  label: string;
  tagline: string;
  description: string;
  quality: string;
  bulbSize: string;
  cloves: string;
  moisture: string;
  shelfLife: string;
  origin: string;
  exportGrade: boolean;
  bestSeller: boolean;
  stockBags: number;
  color: string;
  tiers: PriceTier[];
}

interface UseGradesResult {
  grades: LiveGrade[];
  loading: boolean;
  error: string | null;
}

/** Fetches the live product catalog from Supabase (public read RLS policy on grades). */
export function useGrades(): UseGradesResult {
  const [grades, setGrades] = useState<LiveGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error: queryError } = await supabase
          .from("grades")
          .select("*")
          .order("label");

        if (queryError) throw queryError;
        if (cancelled) return;

        setGrades(
          (data ?? []).map((row) => ({
            id: row.id,
            category: row.category,
            label: row.label,
            tagline: row.tagline ?? "",
            description: row.description ?? "",
            quality: row.quality ?? "",
            bulbSize: row.bulb_size ?? "",
            cloves: row.cloves ?? "",
            moisture: row.moisture ?? "",
            shelfLife: row.shelf_life ?? "",
            origin: row.origin ?? "",
            exportGrade: row.export_grade,
            bestSeller: row.best_seller,
            stockBags: row.stock_bags,
            color: row.color ?? "#D4C4B0",
            tiers: row.tiers,
          }))
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load products");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { grades, loading, error };
}

interface UseGradeResult {
  grade: LiveGrade | null;
  loading: boolean;
  error: string | null;
  /** true once the fetch has completed and no matching row was found. */
  notFound: boolean;
}

/** Fetches a single grade by id from the live Supabase catalog. */
export function useGrade(id: string): UseGradeResult {
  const [grade, setGrade] = useState<LiveGrade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error: queryError } = await supabase
          .from("grades")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (queryError) throw queryError;
        if (cancelled) return;

        if (!data) {
          setNotFound(true);
          return;
        }

        setGrade({
          id: data.id,
          category: data.category,
          label: data.label,
          tagline: data.tagline ?? "",
          description: data.description ?? "",
          quality: data.quality ?? "",
          bulbSize: data.bulb_size ?? "",
          cloves: data.cloves ?? "",
          moisture: data.moisture ?? "",
          shelfLife: data.shelf_life ?? "",
          origin: data.origin ?? "",
          exportGrade: data.export_grade,
          bestSeller: data.best_seller,
          stockBags: data.stock_bags,
          color: data.color ?? "#D4C4B0",
          tiers: data.tiers,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load product");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { grade, loading, error, notFound };
}
