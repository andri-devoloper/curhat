"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
}

interface Curhat {
  id: number;
  content: string;
  createdAt: string;
  comments: Comment[];
}


export default function Home() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [curhats, setCurhats] = useState<Curhat[]>([]);


  useEffect(() => {
    const fetchCurhats = async () => {
      try {
        const response = await fetch("/api/curhat");
        if (!response.ok) {
          throw new Error("Failed to fetch curhats");
        }
        const data = await response.json();
        setCurhats(data);
      } catch (error) {
        console.error("Error fetching curhats:", error);
      }
    };
    fetchCurhats();
  }, [curhats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/curhat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post curhat");
      }



      setContent("");
      console.log('Curhat Berhasil ditambhakan')
    } catch (error) {
      console.error("Error fetching curhats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (curhatId: number, content: string) => {
    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curhatId, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post comment");
      }

      // alert("Komentar berhasil ditambahkan!");


      const newCurhats = await fetch("/api/curhat");
      const newCurhatsData = await newCurhats.json();
      setCurhats(newCurhatsData);
    } catch (error) {
      console.error("Error fetching curhats:", error);
    }
  };

  const handleDeleteCurhat = async (curhatId: number) => {
    try {
      const response = await fetch(`/api/curhat/${curhatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete curhat");
      }

      // Perbarui state lokal setelah curhat dihapus
      setCurhats((prevCurhats) => prevCurhats.filter((curhat) => curhat.id !== curhatId));

      alert("Curhat berhasil dihapus!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error("Error deleting curhat:");
      // alert("Gagal menghapus curhat!");
    }
  };



  return (
    <div className="py-10 px-20 fractal-background">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded text-black font-bold bg-[#a7c7e793] outline-none border-none"
          rows={4}
          placeholder="Tulis curhat Anda..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Tambah Curhat"}
        </button>

      </form>
      <div className="mt-10 space-y-4  rounded">
        {curhats.length === 0 ? (
          <p className="inline-block bg-primary">Tidak ada curhat untuk ditampilkan.</p>
        ) : (
          curhats.map((curhat) => (
            <div key={curhat.id} className="border p-4 rounded-lg bg-[#a7c7e793] ">
              <h1 className="font-bold text-2xl">{curhat.content}</h1>
              <p className="text-sm text-black-700">{new Date(curhat.createdAt).toLocaleString()}</p>
              <button
                onClick={() => handleDeleteCurhat(curhat.id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hapus Curhat
              </button>
              {/* Comments for the curhat */}
              <div className="mt-4">
                <h3 className="font-bold text-md">Komentar:</h3>
                {curhat.comments.length === 0 ? (
                  <p>Tidak ada komentar untuk curhat ini.</p>
                ) : (
                  curhat.comments.map((comment) => (
                    <div key={comment.id} className="border-t pt-2 mt-2">
                      <p className="font-bold text-2xl">{comment.content}</p>
                      <p className="text-sm text-black-700">{new Date(comment.createdAt).toLocaleString()}</p>

                    </div>
                  ))
                )}
                <textarea
                  className="w-full p-2 border rounded mt-2 font-bold bg-[#ADD8E6] text-black outline-none border-none"
                  rows={2}
                  placeholder="Tulis komentar..."
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <button
                  onClick={() => handleSubmitComment(curhat.id, content)}
                  className="mt-2 px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600"
                >
                  Tambah Komentar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
