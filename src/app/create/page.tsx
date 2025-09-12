import { PostCreationForm } from "@/components/create/post-creation-form"

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-clip-text text-transparent">
                        Create New Post
                    </h1>
                    <p className="text-blue-900 text-lg">Make it engaging and informative</p>
                </div>
                <PostCreationForm />
            </div>
        </main>
    )
}
