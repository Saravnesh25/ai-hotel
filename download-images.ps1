# Download hotel website images for your Next.js project
# Run this script in PowerShell from your project root (where package.json is)

$images = @(
  @{ url = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"; path = ".\public\hotel-hero.jpg" },
  @{ url = "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"; path = ".\public\room1.jpg" },
  @{ url = "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"; path = ".\public\room2.jpg" },
  @{ url = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"; path = ".\public\room3.jpg" },
  @{ url = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"; path = ".\public\chatbot-avatar.png" },
  @{ url = "https://cdn-icons-png.flaticon.com/512/235/235861.png"; path = ".\public\favicon.ico" }
)

foreach ($img in $images) {
  Invoke-WebRequest -Uri $img.url -OutFile $img.path
  Write-Host "Downloaded $($img.path)"
}
