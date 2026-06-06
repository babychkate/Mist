using Mist.Models;
using Mist.Models.Generated;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Mist.Data;
public partial class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public virtual DbSet<Generation> Generations { get; set; }

    public virtual DbSet<GenerationPlatform> GenerationPlatforms { get; set; }

    public virtual DbSet<GenerationPlatformMusicTrack> GenerationPlatformMusicTracks { get; set; }

    public virtual DbSet<GenerationPlatformPhoto> GenerationPlatformPhotos { get; set; }

    public virtual DbSet<GenerationPlatformTone> GenerationPlatformTones { get; set; }

    public virtual DbSet<Music> Musics { get; set; }

    public virtual DbSet<MusicAuthor> MusicAuthors { get; set; }

    public virtual DbSet<Photo> Photos { get; set; }

    public virtual DbSet<PhotoFormatType> PhotoFormatTypes { get; set; }

    public virtual DbSet<PhotoType> PhotoTypes { get; set; }

    public virtual DbSet<Platform> Platforms { get; set; }

    public virtual DbSet<PlatformPhotoFormat> PlatformPhotoFormats { get; set; }

    public virtual DbSet<Tone> Tones { get; set; }

    public virtual DbSet<Video> Videos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Generation>(entity =>
        {
            entity.HasKey(e => e.GenerationId).HasName("PK__generati__F887D65A3DD55360");

            entity.ToTable("generation");

            entity.Property(e => e.GenerationId).HasColumnName("generation_id");
            entity.Property(e => e.GenerationCreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("generation_created_at");
            entity.Property(e => e.GenerationUserId)
                .HasMaxLength(450)
                .HasColumnName("generation_user_id");
            entity.Property(e => e.GenerationVideoId).HasColumnName("generation_video_id");

            entity.HasOne(d => d.GenerationVideo).WithMany(p => p.Generations)
                .HasForeignKey(d => d.GenerationVideoId)
                .HasConstraintName("FK__generatio__gener__5070F446");

            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(g => g.GenerationUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<GenerationPlatform>(entity =>
        {
            entity.HasKey(e => e.GenerationPlatformId).HasName("PK__generati__C3847D27B684AF25");

            entity.ToTable("generation_platform");

            entity.HasIndex(e => new { e.GenerationPlatformGenerationId, e.GenerationPlatformPlatformId }, "UQ__generati__5F121C0B95AADF25").IsUnique();

            entity.Property(e => e.GenerationPlatformId).HasColumnName("generation_platform_id");
            entity.Property(e => e.GenerationPlatformCustomPrompt)
                .HasMaxLength(500)
                .HasColumnName("generation_platform_custom_prompt");
            entity.Property(e => e.GenerationPlatformGeneratedHashtags).HasColumnName("generation_platform_generated_hashtags");
            entity.Property(e => e.GenerationPlatformGeneratedText).HasColumnName("generation_platform_generated_text");
            entity.Property(e => e.GenerationPlatformGenerationId).HasColumnName("generation_platform_generation_id");
            entity.Property(e => e.GenerationPlatformPlatformId).HasColumnName("generation_platform_platform_id");

            entity.HasOne(d => d.GenerationPlatformGeneration).WithMany(p => p.GenerationPlatforms)
                .HasForeignKey(d => d.GenerationPlatformGenerationId)
                .HasConstraintName("FK__generatio__gener__5535A963");

            entity.HasOne(d => d.GenerationPlatformPlatform).WithMany(p => p.GenerationPlatforms)
                .HasForeignKey(d => d.GenerationPlatformPlatformId)
                .HasConstraintName("FK__generatio__gener__5629CD9C");
        });

        modelBuilder.Entity<GenerationPlatformMusicTrack>(entity =>
        {
            entity.HasKey(e => e.GenerationPlatformMusicTrackId).HasName("PK__generati__14848B198C25FA94");

            entity.ToTable("generation_platform_music_track");

            entity.HasIndex(e => e.GenerationPlatformMusicTrackGenerationPlatformId, "UQ__generati__39544437D683B3B5").IsUnique();

            entity.Property(e => e.GenerationPlatformMusicTrackId).HasColumnName("generation_platform_music_track_id");
            entity.Property(e => e.GenerationPlatformMusicTrackGenerationPlatformId).HasColumnName("generation_platform_music_track_generation_platform_id");
            entity.Property(e => e.GenerationPlatformMusicTrackMusicId).HasColumnName("generation_platform_music_track_music_id");

            entity.HasOne(d => d.GenerationPlatformMusicTrackGenerationPlatform).WithOne(p => p.GenerationPlatformMusicTrack)
                .HasForeignKey<GenerationPlatformMusicTrack>(d => d.GenerationPlatformMusicTrackGenerationPlatformId)
                .HasConstraintName("FK__generatio__gener__5EBF139D");

            entity.HasOne(d => d.GenerationPlatformMusicTrackMusic).WithMany(p => p.GenerationPlatformMusicTracks)
                .HasForeignKey(d => d.GenerationPlatformMusicTrackMusicId)
                .HasConstraintName("FK__generatio__gener__5FB337D6");
        });

        modelBuilder.Entity<GenerationPlatformPhoto>(entity =>
        {
            entity.HasKey(e => e.GenerationPlatformPhotoId).HasName("PK__generati__26EB45BF729145AE");

            entity.ToTable("generation_platform_photo");

            entity.Property(e => e.GenerationPlatformPhotoId).HasColumnName("generation_platform_photo_id");
            entity.Property(e => e.GenerationPlatformPhotoGenerationPlatformId).HasColumnName("generation_platform_photo_generation_platform_id");
            entity.Property(e => e.GenerationPlatformPhotoPhotoId).HasColumnName("generation_platform_photo_photo_id");
            entity.Property(e => e.GenerationPlatformPhotoPlatformPhotoFormatId).HasColumnName("generation_platform_photo_platform_photo_format_id");

            entity.HasOne(d => d.GenerationPlatformPhotoGenerationPlatform).WithMany(p => p.GenerationPlatformPhotos)
                .HasForeignKey(d => d.GenerationPlatformPhotoGenerationPlatformId)
                .HasConstraintName("FK__generatio__gener__628FA481");

            entity.HasOne(d => d.GenerationPlatformPhotoPhoto).WithMany(p => p.GenerationPlatformPhotos)
                .HasForeignKey(d => d.GenerationPlatformPhotoPhotoId)
                .HasConstraintName("FK__generatio__gener__6383C8BA");

            entity.HasOne(d => d.GenerationPlatformPhotoPlatformPhotoFormat).WithMany(p => p.GenerationPlatformPhotos)
                .HasForeignKey(d => d.GenerationPlatformPhotoPlatformPhotoFormatId)
                .HasConstraintName("FK__generatio__gener__6477ECF3");
        });

        modelBuilder.Entity<GenerationPlatformTone>(entity =>
        {
            entity.HasKey(e => e.GenerationPlatformToneId).HasName("PK__generati__E7F79C567C9A0627");

            entity.ToTable("generation_platform_tone");

            entity.HasIndex(e => e.GenerationPlatformToneGenerationPlatformId, "UQ__generati__FEFCA7CCE2115AFF").IsUnique();

            entity.Property(e => e.GenerationPlatformToneId).HasColumnName("generation_platform_tone_id");
            entity.Property(e => e.GenerationPlatformToneGenerationPlatformId).HasColumnName("generation_platform_tone_generation_platform_id");
            entity.Property(e => e.GenerationPlatformToneToneId).HasColumnName("generation_platform_tone_tone_id");

            entity.HasOne(d => d.GenerationPlatformToneGenerationPlatform).WithOne(p => p.GenerationPlatformTone)
                .HasForeignKey<GenerationPlatformTone>(d => d.GenerationPlatformToneGenerationPlatformId)
                .HasConstraintName("FK__generatio__gener__59FA5E80");

            entity.HasOne(d => d.GenerationPlatformToneTone).WithMany(p => p.GenerationPlatformTones)
                .HasForeignKey(d => d.GenerationPlatformToneToneId)
                .HasConstraintName("FK__generatio__gener__5AEE82B9");
        });

        modelBuilder.Entity<Music>(entity =>
        {
            entity.HasKey(e => e.MusicId).HasName("PK__music__B1C42D0BF4E86D9D");

            entity.ToTable("music");

            entity.HasIndex(e => e.MusicApiId, "UQ__music__EB599E8E7476271E").IsUnique();

            entity.Property(e => e.MusicId).HasColumnName("music_id");
            entity.Property(e => e.MusicAuthorId).HasColumnName("music_author_id");
            entity.Property(e => e.MusicDuration).HasColumnName("music_duration");
            entity.Property(e => e.MusicGenre)
                .HasMaxLength(30)
                .HasColumnName("music_genre");
            entity.Property(e => e.MusicApiId).HasColumnName("music_api_id");
            entity.Property(e => e.MusicPreviewUrl)
                .HasMaxLength(500)
                .HasColumnName("music_preview_url");
            entity.Property(e => e.MusicTitle)
                .HasMaxLength(50)
                .HasColumnName("music_title");

            entity.HasOne(d => d.MusicAuthor).WithMany(p => p.Musics)
                .HasForeignKey(d => d.MusicAuthorId)
                .HasConstraintName("FK__music__music_aut__440B1D61");
        });

        modelBuilder.Entity<MusicAuthor>(entity =>
        {
            entity.HasKey(e => e.MusicAuthorId).HasName("PK__music_au__5D3599146C10ADF4");

            entity.ToTable("music_author");

            entity.HasIndex(e => e.MusicAuthorApiId, "UQ__music_au__68C637690D6937C7").IsUnique();

            entity.Property(e => e.MusicAuthorId).HasColumnName("music_author_id");
            entity.Property(e => e.MusicAuthorName)
                .HasMaxLength(50)
                .HasColumnName("music_author_name");
            entity.Property(e => e.MusicAuthorApiId).HasColumnName("music_author_api_id");
        });

        modelBuilder.Entity<Photo>(entity =>
        {
            entity.HasKey(e => e.PhotoId).HasName("PK__photo__CB48C83D0242559A");

            entity.ToTable("photo");

            entity.HasIndex(e => e.PhotoUrl, "UQ__photo__1464808BCF073DD7").IsUnique();

            entity.Property(e => e.PhotoId).HasColumnName("photo_id");
            entity.Property(e => e.PhotoTypeId).HasColumnName("photo_type_id");
            entity.Property(e => e.PhotoUrl)
                .HasMaxLength(500)
                .HasColumnName("photo_url");

            entity.HasOne(d => d.PhotoType).WithMany(p => p.Photos)
                .HasForeignKey(d => d.PhotoTypeId)
                .HasConstraintName("FK__photo__photo_typ__47DBAE45");
        });

        modelBuilder.Entity<PhotoFormatType>(entity =>
        {
            entity.HasKey(e => e.PhotoFormatTypeId).HasName("PK__photo_fo__B76EA87C491AB0F2");

            entity.ToTable("photo_format_type");

            entity.Property(e => e.PhotoFormatTypeId).HasColumnName("photo_format_type_id");
            entity.Property(e => e.PhotoFormatTypeName)
                .HasMaxLength(50)
                .HasColumnName("photo_format_type_name");
        });

        modelBuilder.Entity<PhotoType>(entity =>
        {
            entity.HasKey(e => e.PhotoTypeId).HasName("PK__photo_ty__717B633E4C201C64");

            entity.ToTable("photo_type");

            entity.Property(e => e.PhotoTypeId).HasColumnName("photo_type_id");
            entity.Property(e => e.PhotoTypeName)
                .HasMaxLength(50)
                .HasColumnName("photo_type_name");
        });

        modelBuilder.Entity<Platform>(entity =>
        {
            entity.HasKey(e => e.PlatformId).HasName("PK__platform__5F8F663CA60B7156");

            entity.ToTable("platform");

            entity.Property(e => e.PlatformId).HasColumnName("platform_id");
            entity.Property(e => e.PlatformDescription)
                .HasMaxLength(70)
                .HasColumnName("platform_description");
            entity.Property(e => e.PlatformMaxCharacters).HasColumnName("platform_max_characters");
            entity.Property(e => e.PlatformName)
                .HasMaxLength(30)
                .HasColumnName("platform_name");
            entity.Property(e => e.PlatformPostingTimeSuggestion)
                .HasMaxLength(100)
                .HasColumnName("platform_posting_time_suggestion");
        });

        modelBuilder.Entity<PlatformPhotoFormat>(entity =>
        {
            entity.HasKey(e => e.PlatformPhotoFormatId).HasName("PK__platform__BEE53985BB33B93A");

            entity.ToTable("platform_photo_format");

            entity.Property(e => e.PlatformPhotoFormatId).HasColumnName("platform_photo_format_id");
            entity.Property(e => e.PlatformPhotoFormatHeight).HasColumnName("platform_photo_format_height");
            entity.Property(e => e.PlatformPhotoFormatPlatformId).HasColumnName("platform_photo_format_platform_id");
            entity.Property(e => e.PlatformPhotoFormatTypeId).HasColumnName("platform_photo_format_type_id");
            entity.Property(e => e.PlatformPhotoFormatWidth).HasColumnName("platform_photo_format_width");

            entity.HasOne(d => d.PlatformPhotoFormatPlatform).WithMany(p => p.PlatformPhotoFormats)
                .HasForeignKey(d => d.PlatformPhotoFormatPlatformId)
                .HasConstraintName("FK__platform___platf__4CA06362");

            entity.HasOne(d => d.PlatformPhotoFormatType).WithMany(p => p.PlatformPhotoFormats)
                .HasForeignKey(d => d.PlatformPhotoFormatTypeId)
                .HasConstraintName("FK__platform___platf__4D94879B");
        });

        modelBuilder.Entity<Tone>(entity =>
        {
            entity.HasKey(e => e.ToneId).HasName("PK__tone__B94ECD213A176693");

            entity.ToTable("tone");

            entity.Property(e => e.ToneId).HasColumnName("tone_id");
            entity.Property(e => e.ToneDescription)
                .HasMaxLength(100)
                .HasColumnName("tone_description");
            entity.Property(e => e.ToneName)
                .HasMaxLength(30)
                .HasColumnName("tone_name");
        });

        modelBuilder.Entity<Video>(entity =>
        {
            entity.HasKey(e => e.VideoId).HasName("PK__video__E8F11E1099286C88");

            entity.ToTable("video");

            entity.HasIndex(e => e.VideoYoutubeId, "UQ__video__2A5DFD1820BEA56F").IsUnique();

            entity.Property(e => e.VideoId).HasColumnName("video_id");
            entity.Property(e => e.VideoChannelName)
                .HasMaxLength(50)
                .HasColumnName("video_channel_name");
            entity.Property(e => e.VideoDescription).HasColumnName("video_description");
            entity.Property(e => e.VideoTitle)
                .HasMaxLength(100)
                .HasColumnName("video_title");
            entity.Property(e => e.VideoYoutubeId)
                .HasMaxLength(20)
                .HasColumnName("video_youtube_id");
            entity.Property(e => e.VideoTags)
                .HasMaxLength(500)
                .HasColumnName("video_tags");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
