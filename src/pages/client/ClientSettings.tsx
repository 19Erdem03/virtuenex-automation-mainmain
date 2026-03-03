import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useDropzone } from "react-dropzone";
import { User, Save, Mail, UploadCloud, Loader2, Instagram, Linkedin, Globe } from "lucide-react";
import { toast } from "sonner";

export function ClientSettings() {
    const { user, profile } = useAuth();

    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [instagram, setInstagram] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "");
            setAvatarUrl(profile.avatar_url || "");
            setInstagram(profile.instagram || "");
            setLinkedin(profile.linkedin || "");
            setCompanyWebsite(profile.company_website || "");
        }
    }, [profile]);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (!user || acceptedFiles.length === 0) return;
            setIsUploading(true);
            try {
                const file = acceptedFiles[0];
                const filePath = `${user.id}/avatar`;

                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, file, { upsert: true });
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
                setAvatarUrl(publicUrl);

                await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
                toast.success("Avatar updated");
            } catch (err: any) {
                toast.error(err.message || "Error uploading image");
            } finally {
                setIsUploading(false);
            }
        },
        [user]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
        maxFiles: 1,
        multiple: false,
    });

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ full_name: fullName, avatar_url: avatarUrl, instagram, linkedin, company_website: companyWebsite })
                .eq("id", user.id);
            if (error) throw error;
            toast.success("Profile saved successfully");
            setTimeout(() => window.location.reload(), 800);
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-xl flex flex-col gap-8">
            {/* Avatar */}
            <div className="flex items-center gap-5">
                <div {...getRootProps()} className="relative group cursor-pointer shrink-0">
                    <input {...getInputProps()} />
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-[#FFBF00]/50 transition-colors">
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 text-[#FFBF00] animate-spin" />
                        ) : avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-semibold text-[#FFBF00]">
                                {fullName ? fullName.charAt(0).toUpperCase() : "C"}
                            </span>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadCloud className="w-5 h-5 text-white mb-0.5" />
                        <span className="text-[9px] text-white font-medium">Upload</span>
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-white">{fullName || "Your Name"}</p>
                    <p className="text-xs text-white/40 mt-0.5">{profile?.email}</p>
                    <p className="text-xs text-[#FFBF00]/70 mt-1 uppercase tracking-wider font-mono">{profile?.role}</p>
                </div>
            </div>

            {/* Form */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-5">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFBF00]/50 focus:ring-1 focus:ring-[#FFBF00]/30 transition-all"
                        />
                    </div>
                </div>

                {/* Email (read-only) */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="w-full bg-black/20 border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white/30 cursor-not-allowed"
                        />
                    </div>
                    <p className="text-xs text-white/25">Email cannot be changed.</p>
                </div>

                {/* Instagram */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Instagram</label>
                    <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            placeholder="your_handle or URL"
                            className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFBF00]/50 focus:ring-1 focus:ring-[#FFBF00]/30 transition-all"
                        />
                    </div>
                </div>

                {/* LinkedIn */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">LinkedIn</label>
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="LinkedIn URL"
                            className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFBF00]/50 focus:ring-1 focus:ring-[#FFBF00]/30 transition-all"
                        />
                    </div>
                </div>

                {/* Company Website */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Company Website</label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFBF00]/50 focus:ring-1 focus:ring-[#FFBF00]/30 transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-[#FFBF00] hover:bg-[#FFBF00]/90 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "Saving…" : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
